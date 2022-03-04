const express = require('express') // import express
const app = express() // create an express instance
const ejsLayouts = require('express-ejs-layouts') // import ejs layouts
require('dotenv').config()// allows us to access env vars
const cookieParser = require('cookie-parser')
const cryptojs = require('crypto-js')
const db = require('./models/index.js')
const axios = require('axios')
const methodOverride = require('method-override')


//MIDDLEWARE
app.use(methodOverride('_method'))
app.set('view engine', 'ejs') // set the view engine to ejs
app.use(ejsLayouts) // tell express we want to use layouts
app.use(cookieParser()) //give us acces to req.cookies
app.use(express.urlencoded({extended:false})) //body parser to make req.body work
app.use("/public", express.static("public"))

//CUSTOM LOGIN MIDDLEWARE
app.use(async (req,res,next)=>{
    if (req.cookies.userId){
        const decryptedId = cryptojs.AES.decrypt(req.cookies.userId, process.env.SECRET)
        const decryptedIdString = decryptedId.toString(cryptojs.enc.Utf8)
        const user = await db.user.findByPk(decryptedIdString)
        res.locals.user = user
    } else res.locals.user = null
    next()
})

//CONTROLLERS
app.use('/users',require('./controllers/users.js'))
app.use('/albums',require('./controllers/albums.js'))
app.use('/categories',require('./controllers/categories.js'))
app.use('/artists',require('./controllers/artists.js'))



//ROUTES
app.get('/',(req,res)=>{
    res.render('home.ejs')
})

app.get('/results',(req,res)=>{
    const url = `https://api.discogs.com/database/search?q=${req.query.q}&token=${process.env.DISCOGS_TOKEN}`
    axios.get(url)
    .then(response=>{
        const artistMatches = response.data.results
        const filteredArtists = artistMatches.filter(result=> {return result.type==='artist'})
        res.render('artists/index.ejs',{artists: filteredArtists})  
        // res.send(response.data.results)
    })
    .catch(err=>{
        console.log(err)
    })
})

app.get('/results/:id',(req,res)=>{
    const url = `https://api.discogs.com/artists/${req.params.id}/releases?token=${process.env.DISCOGS_TOKEN}`
     axios.get(url)
    .then(response=>{
        const allReleases = response.data.releases
        const filteredReleases = allReleases.filter(release=>{return release.type==='master'})
        filteredReleases.sort((a,b)=>{
          return  b.stats.community.in_collection - a.stats.community.in_collection
        })
        const currentUser = await db.user.findOne({where: {id: res.locals.user.id}})
        const albums = await currentUser.getAlbums()
        res.render('albums/show.ejs',{releases: filteredReleases, })
        // res.send(filteredReleases)
    })
    .catch(err=>{
        console.log(err)
    })
})




const PORT = process.env.PORT || 8000
app.listen(8000,()=>{
    console.log('listening on 8000')
})
const express = require('express') // import express
const app = express() // create an express instance
const ejsLayouts = require('express-ejs-layouts') // import ejs layouts
require('dotenv').config()// allows us to access env vars
const cookieParser = require('cookie-parser')
const cryptojs = require('crypto-js')
const db = require('./models/index.js')
const axios = require('axios')


//MIDDLEWARE
app.set('view engine', 'ejs') // set the view engine to ejs
app.use(ejsLayouts) // tell express we want to use layouts
app.use(cookieParser()) //give us acces to req.cookies
app.use(express.urlencoded({extended:false})) //body parser to make req.body work

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

//ROUTES
app.get('/',(req,res)=>{
    res.render('home.ejs')
})

app.get('/results',(req,res)=>{
    axios.get("https://api.discogs.com/releases/16170061")
    .then(response=>{
        res.send(response.data)
    })
    // res.send('home.ejs')
})



const PORT = process.env.PORT || 8000
app.listen(8000,()=>{
    console.log('listening on 8000')
})
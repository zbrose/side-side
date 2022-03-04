const express = require('express')
const db = require('../models')
const user = require('../models/user')
const router = express.Router()
const bcrypt = require('bcrypt')
const cryptojs = require('crypto-js')
require('dotenv').config()


// GET profile page
router.get('/profile', async (req,res)=>{
    if(req.cookies.userId){
        try{ 
            const currentUser = await db.user.findOne({where: {id: res.locals.user.id}})
            const faves = await currentUser.getAlbums()
            const categories = await currentUser.getCategories()
            res.render('users/profile.ejs',{faves,categories})
        }catch (err){
            console.log(err,'error')
        }
    } else {
        console.log('log in to view profile')
        res.redirect('/users/login')
    }
})


//GET form to create new user
router.get('/new',(req,res)=>{
    res.render('users/new.ejs')
})

//POST new user to database
router.post('/', async (req,res)=>{
   const [newUser, created] = await db.user.findOrCreate({
        where: {email: req.body.email}
    })
    if(!created){
        console.log("user already exists")
        //render login page and send appropriate message
    } else {
        const hashedPassword = bcrypt.hashSync(req.body.password, 10)
        newUser.password = hashedPassword
        await newUser.save()

        // encrypt the user id via AES
        const encryptedUserId = cryptojs.AES.encrypt(newUser.id.toString(),process.env.SECRET)
        const encryptedUserIdString = encryptedUserId.toString()
        // store the encpted id in the cookie of the res obj
        res.cookie('userId', encryptedUserIdString)
        // redirect back to the home page
        res.redirect('/')
    }
})

// POST album to database
router.post('/:id/album', async (req,res)=>{
    try {
        const user = await db.user.findByPk(req.params.id)
        await user.addAlbum(req.body)
        // console.log(req.body,req.params.id,'added to collection')
        res.redirect('/users/profile')
    }catch(err){
        console.log(err)
        res.redirect('/users/profile')
    }
})


router.get('/login',(req,res)=>{
    res.render('users/login.ejs', {error: null})
})

router.post('/login', async (req,res)=>{
   const user = await db.user.findOne({
       where: {email: req.body.email}
   })
   if(!user){ //didnt find usr in database
       console.log('user not found')
       res.render('users/login.ejs',{error: 'Invalid email/password'})
   } else if (!bcrypt.compareSync(req.body.password, user.password)) {
       console.log('incorrect password')
       res.render('users/login.ejs',{error: 'Invalid email/password'})
   } else {
       console.log('logging in the user')
          // encrypt the user id via AES
          const encryptedUserId = cryptojs.AES.encrypt(user.id.toString(),process.env.SECRET)

          const encryptedUserIdString = encryptedUserId.toString()
          // store the encpted id in the cookie of the res obj
          res.cookie('userId', encryptedUserIdString)
          // redirect back to the home page
          res.redirect('/')
   }
})

router.get('/logout',(req,res)=>{
    console.log('loggin out')
    res.clearCookie('userId')
    res.redirect('/')
})



module.exports = router 
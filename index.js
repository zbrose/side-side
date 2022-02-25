const express = require('express') // import express
const app = express() // create an express instance
const ejsLayouts = require('express-ejs-layouts') // import ejs layouts
require('dotenv').config()// allows us to access env vars

//MIDDLEWARE
app.set('view engine', 'ejs') // set the view engine to ejs
app.use(ejsLayouts) // tell express we want to use layouts

//CONTROLLERS
app.use('/users',require('./controllers/users.js'))

//ROUTES
app.get('/',(req,res)=>{
    res.render('home.ejs')
})


const PORT = process.env.PORT || 8000
app.listen(8000,()=>{
    console.log('listening on 8000')
})
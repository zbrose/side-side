const express = require('express')
const db = require('../models')
const user = require('../models/user')
const router = express.Router()
const axios = require('axios')
require('dotenv').config()


router.get('/:id',async (req,res)=>{
    try{
        const response = await axios.get(`https://api.discogs.com/artists/${req.params.id}?token=${process.env.DISCOGS_TOKEN}`)
        console.log('data',response.data.images)
        res.render('artists/details.ejs',{artist: response.data})
        // res.send(response.data)
    }catch (err){
        console.log('err',err)
    }
})


module.exports = router
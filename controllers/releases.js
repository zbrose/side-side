const express = require('express')
const db = require('../models')
const user = require('../models/user')
const router = express.Router()
const axios = require('axios')
require('dotenv').config()


router.get('/:id',async (req,res)=>{
    try{
        const response = await axios.get(`https://api.discogs.com/masters/${req.params.id}?token=${process.env.DISCOGS_TOKEN}`)
        res.render('artists/details.ejs',{results: response.data})
    }catch (err){
        console.log(err,'error')
    }
})

module.exports = router
const express = require('express')
const db = require('../models')
const user = require('../models/user')
const router = express.Router()
const axios = require('axios')
require('dotenv').config()


router.get('/:id',async (req,res)=>{
    try{
        const url = 
    }catch (err){
        console.log(err,'error')
    }
})

module.exports = router
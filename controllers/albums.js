const express = require('express')
const db = require('../models')
const user = require('../models/user')
const router = express.Router()
const axios = require('axios')
require('dotenv').config()


//GET album details
router.get('/:id',async (req,res)=>{
    try{
        const response = await axios.get(`https://api.discogs.com/masters/${req.params.id}?token=${process.env.DISCOGS_TOKEN}`)
        res.render('albums/details.ejs',{results: response.data})
        // res.send(response.data)
    }catch (err){
        console.log(err,'error')
    }
})

// DELETE album from collection
router.delete('/:albumId',async (req,res)=>{
    try{
        const foundAlbum = await db.album.findOne({
            where: {
                id: req.params.albumId
            }
        })
         await foundAlbum.destroy()
        res.redirect('/users/profile')
    }catch (err){
        console.log(err)
    }
})



module.exports = router
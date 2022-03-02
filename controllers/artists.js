const express = require('express')
const db = require('../models')
const user = require('../models/user')
const router = express.Router()
const axios = require('axios')
require('dotenv').config()


router.get('/:id',(req,res)=>{
    const url = `https://api.discogs.com/artists/${req.params.id}/releases?token=${process.env.DISCOGS_TOKEN}`
     axios.get(url)
    .then(response=>{
        const allReleases = response.data.releases
        const filteredReleases = allReleases.filter(release=>{return release.type==='master'})
        filteredReleases.sort((a,b)=>{
          return  b.stats.community.in_collection - a.stats.community.in_collection
        })
        res.render('albums/show.ejs',{releases: filteredReleases})
        // res.send(filteredReleases)
    })
    .catch(err=>{
        console.log(err)
    })
})


module.exports = router
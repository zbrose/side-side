const express = require('express')
const db = require('../models')
const user = require('../models/user')
const router = express.Router()
const axios = require('axios')
const { RowDescriptionMessage } = require('pg-protocol/dist/messages')
require('dotenv').config()


router.get("/", async (req, res) => {
    try {
        const categories = await db.category.findAll();
        res.render("categories/index", { categories });
    } catch (error) {
        console.log(error);
        res.status(400).render("main/404");
    }
});

router.post('/', async (req,res)=>{
    try{    
        const [newCategory, newCategoryCreated] = await db.category.findOrCreate({
            where: {
                name: req.body.name,
                description: req.body.description,
                userId: req.body.userId
            }
        })
        console.log(newCategory,newCategoryCreated)
        res.redirect('/categories')
    }catch (err){
        console.log(err)
    }
})
router.post('/albums', async (req,res)=>{
    try{    
        const [newAlbum, newAlbumCreated] = await db.album.findOrCreate({
            where: {
                albumId: req.body.albumId
            }
        })
        console.log(newAlbum)
        res.redirect('/categories')
    }catch (err){
        console.log(err)
    }
})



router.get("/new", (req, res) => {
    if (req.cookies.userId) {
        res.render("categories/new", { user: res.locals.user });
    } else {
        res.redirect("/users/login");
    }
});

router.get('/:id', (req,res)=>{ // display records assigned with this category
    res.render('categories/show.ejs')
})

router.put('/:id', async (req,res)=>{
    try {
        const category = await db.category.findOne({
            where: {
                id:req.params.id
            }
        })
        category.update({
            name: req.body.name,
            description: req.body.description
        })
        await category.save()
        res.redirect('/categories')
    }catch(err){
        console.log(err)
    }
})

router.get('/edit/:id', async (req,res)=>{
    try {
        const category = await db.category.findOne({
            where: {
                id:req.params.id
                
            },
        })
        res.render('categories/edit.ejs', {category: category})
    }catch (err){
        console.log(err)
    }
})



router.delete('/:categoryId',async (req,res)=>{
    try{
        const foundCategory = await db.category.findOne({
            where: {
                id: req.params.categoryId
            }
        })
         await foundCategory.destroy()
        res.redirect('/categories')
    }catch (err){
        console.log(err)
    }
})





module.exports = router
const express = require('express')
const db = require('../models')
const user = require('../models/user')
const router = express.Router()
require('dotenv').config()


// GET list of all categories
router.get("/", async (req, res) => {
   if(req.cookies.userId ){
        try {
            const currentUser = await db.user.findOne({where: {id: res.locals.user.id}})
            const categories = await currentUser.getCategories()
           res.render("categories/index", { categories });
       } catch (error) {
           console.log(error);
           res.status(400).render("main/404");
       }
   } else res.redirect('/users/login')
});

// POST new category to database
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

//POST Album to a category
router.post('/albums', async (req,res)=>{ 
    console.log(req.body.category.id,'logged')
    try{    
        const category = JSON.parse(req.body.category)
        const newAlbum = await db.album.findOne({
            where: {
                id: req.body.albumId
            }
        })
        const newCategory = await db.category.findOne({
            where: {
                id: category.id
            }
        })
        await newCategory.addAlbum(newAlbum)

        res.redirect('/categories')
    }catch (err){
        console.log(err)
    }
})

//GET new category form
router.get("/new", (req, res) => {
    if (req.cookies.userId) {
        res.render("categories/new", { user: res.locals.user });
    } else {
        res.redirect("/users/login");
    }
});

//GET list of albums in selected category
router.get('/:id', async (req,res)=>{ 
   try{
       const foundCategory = await db.category.findOne({
           where: {
               id: req.params.id
           }
       })
       const categoriesAlbums = await foundCategory.getAlbums()
       res.render('categories/show.ejs', {categoriesAlbums, foundCategory})
    } catch (err){
        console.log(err)
    }
})

//PUT update category name and description
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

// GET edit form for categories
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

// DELETE category
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
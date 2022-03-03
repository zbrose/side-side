const express = require('express')
const db = require('../models')
const user = require('../models/user')
const router = express.Router()
const axios = require('axios')
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


router.get("/new", (req, res) => {
    if (req.cookies.userId) {
        res.render("categories/new", { user: res.locals.user });
    } else {
        res.redirect("/users/login");
    }
});

module.exports = router
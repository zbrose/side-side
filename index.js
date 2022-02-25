const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const app = express()

app.get('/',(req,res)=>{
    res.send('we here')
})


app.listen(8000,()=>{
    console.log('listening on 3000')
})
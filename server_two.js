const express = require('express')
const app = express()
require('dotenv').config()

const port = process.env.SECOND_PORT || 5001



app.listen(port, ()=>{
    console.log(`${port} is running....`)
})
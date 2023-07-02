const express = require('express')
const app = express()
require('dotenv').config({path: '../.env'})
const {connect} = require('../database/db.js')
const cors = require('cors')

const port = process.env.SECOND_PORT || 5001

connect()
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use(cors())

app.use('/', require('./routes/user.route.js'))




app.listen(port, ()=> console.log(`Server is running on ${port}`))
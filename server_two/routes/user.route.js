const express = require('express')
const router = express.Router()

const {
    getProduct
} = require('../controllers/user.controller.js')


//Get products
router
.get('/get-products', getProduct)





module.exports = router
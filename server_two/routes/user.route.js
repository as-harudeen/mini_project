const router = require('express').Router()
const auth = require('../middlewares/auth.js')

const {
    getProduct
} = require('../controllers/user.controller.js')

// router.use(auth)

//Get products
router
.get('/get-products', getProduct)





module.exports = router
const router = require('express').Router()
const auth = require('../middlewares/auth.js')

const {
    getProduct,
    userCart
} = require('../controllers/user.controller.js')

// router.use(auth)

//Get products
router
.get('/get-products', getProduct)


//User cart
router
.get('/cart/:userId', userCart)




module.exports = router
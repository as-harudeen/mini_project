const router = require('express').Router()
const auth = require('../middlewares/auth.js')

const {
    getProduct,
    updateCart,
    userCart
} = require('../controllers/user.controller.js')


//Get products
router
.get('/get-products', getProduct)


router.use(auth)


//User cart
router
.get('/cart/', userCart)

//cart add
router
.put("/cart/update", updateCart)




module.exports = router
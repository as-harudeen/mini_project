const router = require('express').Router()
const auth = require('../middlewares/auth.js')

const {
    getProduct,
    updateCart,
    userCart,
    updateProfile,
    getUser
} = require('../controllers/user.controller.js')


//Get products
router
.get('/get-products', getProduct)


router.use(auth)


//get user
router.get('/user', getUser)

//User cart
router
.get('/cart/', userCart)

//cart add
router
.put("/cart/update", updateCart)

//Profile update
router
.put("/profile/update", updateProfile)




module.exports = router
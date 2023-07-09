const router = require('express').Router()
const auth = require('../middlewares/auth.js')

const {
    getProduct,
    updateCart,
    userCart,
    updateProfile,
    getUser,
    my_order,
    cancelRequest,
    getCoupons
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


//Order detailes
router
.get("/profile/my_order", my_order)


//Cancel order request
router
.put("/order/cancelrequest/:orderID", cancelRequest)

//GET AVAILABLE COUPONS
router
.get('/getcoupons', getCoupons)



module.exports = router
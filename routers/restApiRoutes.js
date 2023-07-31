const router = require('express').Router()
const auth = require('../middlewares/auth.js')

const {
    getProducts,
    updateCart,
    userCart,
    updateProfile,
    getUser,
    my_order,
    cancelRequest,
    getCoupons,
    addressUpdate,
    addToWhishlist,
    getwhishlist
} = require('../controllers/restApiController.js');


//Get products
router
.get('/get-products', getProducts)


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

//update address
router
.put("/address/:update", addressUpdate)



//Order detailes
router
.get("/profile/my_order", my_order)


//Cancel order request
router
.put("/order/cancelrequest/:order_id/:sub_id", cancelRequest)

//GET AVAILABLE COUPONS
router
.get('/getcoupons', getCoupons)


//Add to whishlist
router
.put('/whishlist/add/', addToWhishlist)

//Get user whishlist
router.get('/getwhishlist', getwhishlist)


module.exports = router
const router = require('express').Router();
const registerMail = require('../controllers/mailer.js')
const {
    register,
    loginWithPass,
    getUser,
    generateOTP,
    verifyOTP,
    count,
    red,
    order,
    createOrder,
    logout
} = require('../controllers/userController.js')
const {
    registerGET,
    loginGET,
    homeGET,
    shopGET,
    productDetailGET,
    cartGET,
    profileGET,
    addressGET,
    editAddressGET,
    checkoutGET,
    orderGET,
    orderViewGET,
    whishlistGET
} = require('../render/user.render.js')
const {verifyUser} = require('../middlewares/user.midleware.js')
const authenticateUser = require('../middlewares/auth/userAuth.js')
const orderAuth = require('../middlewares/auth/orderAuth.js')


//Register
router
.route('/register')
.get(registerGET)
.post(register)


//Login 
router
.route('/login')
.get(loginGET)
.post(verifyUser,loginWithPass)





//Home
router
.route('/')
.get(homeGET)


//Products
router
.route('/shop')
.get(shopGET)


//Document count
router.get('/doc_count/:collection', count)

router.use(authenticateUser)


//Produt details
router
.route('/products/:product_id')
.get(productDetailGET)

//logout
router
.route('/logout')
.get(logout)


//wisilist
router
.route('/whishlist')
.get(whishlistGET)


//Cart
router
.route('/cart')
.get(cartGET)


//Checkout
router
.route('/checkout')
.get(checkoutGET)


//User Account
router
.route('/profile')
.get(profileGET)

//User Address
router
.route('/profile/address')
.get(addressGET)

//Edit Address
router
.route('/profile/address/edit/:address_id')
.get(editAddressGET)

//My Order
router
.route('/profile/order')
.get(orderGET)

//Order view
router
.route('/profile/order/:order_id/:sub_order_id')
.get(orderViewGET)


//Get user
router.post('/get-user', getUser)


//Generate OTP
router.get('/generate-otp/:email', generateOTP)

//verify OTP
router.post('/verify-otp', verifyOTP)



//Order
router.post('/order', orderAuth, order)

//Razorpay
router.post('/razorpay/createOrder', orderAuth, createOrder)



router.get('/test', (req, res)=>{
    console.log("HIHIHIIIHIHIIHIHIHIHIH")
    res.send("OKNIIII")
})


//redis
router.route('/redis')
.get(red)

module.exports = router;
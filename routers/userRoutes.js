const router = require('express').Router();
const {
    register,
    loginWithPass,
    getUser,
    generateOTP,
    verifyOTP,
    count,
    order,
    createOrder,
    logout,
    loginWithOTP,
    returnRequest
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
    otpLoginGET
} = require('../render/user.render.js')
const { verifyUser } = require('../middlewares/user.midleware.js')
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
    .post(verifyUser, loginWithPass)


router
    .route('/login/otp')
    .get(otpLoginGET)
    .post(loginWithOTP);



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

//Generate OTP
router.get('/generate-otp/:email', generateOTP);

//verify OTP
router.post('/verify-otp', verifyOTP)




//Produt details
router
    .route('/products/:product_id')
    .get(authenticateUser, productDetailGET)

//logout
router
    .route('/logout')
    .get(authenticateUser, logout)



//Cart
router
    .route('/cart')
    .get(authenticateUser, cartGET)


//Checkout
router
    .route('/checkout')
    .get(authenticateUser, checkoutGET)


//User Account
router
    .route('/profile')
    .get(authenticateUser, profileGET)

//User Address
router
    .route('/profile/address')
    .get(authenticateUser, addressGET)

//Edit Address
router
    .route('/profile/address/edit/:address_id')
    .get(authenticateUser, editAddressGET)

//My Order
router
    .route('/profile/order')
    .get(authenticateUser, orderGET)

//Order view
router
    .route('/profile/order/:order_id/:sub_order_id')
    .get(authenticateUser, orderViewGET)


//Get user
router.post('/get-user',authenticateUser,  getUser)


//Order
router.post('/order',authenticateUser,  orderAuth, order)

//Return request
router.put('/return/:orderId/:subId',authenticateUser,  returnRequest)

//Razorpay
router.post('/razorpay/createOrder',authenticateUser,  orderAuth, createOrder)





module.exports = router;
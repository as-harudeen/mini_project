const router = require('express').Router();
const registerMail = require('../controllers/mailer.js')
const {
    register,
    loginWithPass,
    getUser,
    generateOTP,
    verifyOTP,
    loginWithOTP,
    red
} = require('../controllers/userController.js')
const {
    registerGET,
    loginGET,
    productGET,
    homeGET,
    shopGET
} = require('../render/user.render.js')
const {verifyUser} = require('../midlewares/user.midleware.js')


//Register
router
.route('/register')
.get(registerGET)
.post(register)


//Login with OTP
router
.route('/login')
.get(loginGET)
.post(verifyUser,loginWithPass)


//Login with OTP
router
.post("/login-otp", verifyUser, loginWithOTP)


//Home
router
.route('/')
.get(homeGET)


//Products
router
.route('/shop')
.get(shopGET)

//Produt details
router
.route('/products/:product_id')
.get()

//Cart
router
.route('/cart')


//Checkout
router
.route('/checkout')
.get()


//User Account
router
.route('/profile')

//Get user
router.post('/get-user', getUser)


//Generate OTP
router.get('/generate-otp', generateOTP)

//verify OTP
router.post('/verify-otp', verifyOTP)

//register mail
router.post('/registerMail', registerMail)

//redis
router.route('/redis')
.get(red)

module.exports = router;
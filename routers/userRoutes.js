const router = require('express').Router();
const registerMail = require('../controllers/mailer.js')
const {
    register,
    loginWithPass,
    getUser,
    verifyUser,
    generateOTP,
    verifyOTP,
    loginWithOTP
} = require('../controllers/userController.js')
const {
    registerGET,
    loginGET
} = require('../render/user.render.js')



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
.get((req, res)=>{
    res.send("Home")
})


//Products
router
.route('/products')
.get()

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

module.exports = router;
const router = require('express').Router();
const registerMail = require('../controllers/mailer.js')
const {
    register,
    loginWithPass,
    getUser,
    generateOTP,
    verifyOTP,
    count,
    red
} = require('../controllers/userController.js')
const {
    registerGET,
    loginGET,
    productGET,
    homeGET,
    shopGET,
    productDetailGET
} = require('../render/user.render.js')
const {verifyUser} = require('../middlewares/user.midleware.js')


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

//Produt details
router
.route('/products/:product_id')
.get(productDetailGET)

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
router.get('/generate-otp/:email', generateOTP)

//verify OTP
router.post('/verify-otp', verifyOTP)


//Document count
router.get('/doc_count/:collection', count)


router.get('/test', (req, res)=>{
    console.log("HIHIHIIIHIHIIHIHIHIHIH")
    res.send("OKNIIII")
})


//redis
router.route('/redis')
.get(red)

module.exports = router;
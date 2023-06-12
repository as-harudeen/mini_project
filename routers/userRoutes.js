const router = require('express').Router();
const {
    register,
    login,
    getUser
} 
= require('../controllers/userController.js')
const {
    registerGET,
    loginGET
} 
= require('../render/user.render.js')

//Register
router
.route('/register')
.get(registerGET)
.post(register)


//Login
router
.route('/login')
.get(loginGET)
.post(login)


//Home
router
.route('/')
.get()


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



module.exports = router;
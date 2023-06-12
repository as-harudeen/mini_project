const router = require('express').Router();
const {
    loginGET,
    panelGET
} 
= require('../render/admin.render.js')



//Login
router
.route("/login")
.get(loginGET)
.post()

//Admin panel
router
.route('/panel')
.get()



//Products
router
.route('/panel/products')
.get()

//Add product
router
.route('/panel/products/add_product')
.get()
.post()

//Edit Product
router
.route('/panel/products/edit_product/:product_id')
.get()
.put()

//Delete Product
router
.route('panel/products/delete_product/:product_id')
.delete()



//User management
router
.route('panel/user_management')
.get()

//Edit user
router
.route('panel/user_management/edit_user/:user_id')
.get()
.put()

//Delete user
router
.route('panel/user_management/delete_user/:user_id')
.delete()



//Orders
router
.route('panel/orders')
.get()

//Edit order
router
.route('panel/orders/edit_order/:order_id')
.get()
.put()

//Delete order
router
.route('/panel/orders/delete_orders/:orders_id')
.delete()


//Logout
router
.route('logout')
.delete()

module.exports = router;
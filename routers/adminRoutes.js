const router = require('express').Router();
const {
    loginGET,
    panelGET,
    addCategoryGET,
    categoryGET,
    editCategoryGET,
    userManagementGET,
    addProductGET
} = require('../render/admin.render.js')
const {
    login,
    addCategory,
    getCategory,
    editCategory,
    disable,
    enable,
    users,
    block,
    unblock,
    logout
} = require("../controllers/adminController.js")

// const authenticate = require('../controllers/auth/adminAuth.js')


router.use((req, res, next)=>{
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    next()
})



//Login
router
.route("/login")
.get(loginGET)
.post(login)


// router.use(authenticate)


//Admin panel
router
.route('/panel')
.get()


//Disable
router
.route('/disable')
.put(disable)

//Enable
router
.route('/enable')
.put(enable)


/**---------CATEGORY MANAGEMENTS-------------- */

//category
router
.route('/panel/category')
.get(categoryGET)

//get category
router
.route('/get-category')
.get(getCategory)

//add category
router
.route('/panel/category/add')
.get(addCategoryGET)
.post(addCategory)

//Edit category
router
.route('/panel/category/edit/:category_name')
.get(editCategoryGET)
.put(editCategory)


/**---------PROCUTS MANAGEMENTS-------------- */

//Products
router
.route('/panel/products')
.get()

//Add product
router
.route('/panel/products/add')
.get(addProductGET)
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


/**---------USER MANAGEMENTS-------------- */

//User management
router
.route('/panel/user_management')
.get(userManagementGET)

//Edit user
router
.route('panel/user_management/edit_user/:user_id')
.get()
.put()

//Delete user
router
.route('panel/user_management/delete_user/:user_id')
.delete()

//Get all users
router
.route('/get-users')
.get(users)


//Block
router
.route('/block/:userId')
.put(block)

//Block
router
.route('/unblock/:userId')
.put(unblock)


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
.route('/logout')
.delete(logout)

module.exports = router;
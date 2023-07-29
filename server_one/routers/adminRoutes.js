const router = require('express').Router();
const multer = require('multer')
const {
    loginGET,
    panelGET,
    addCategoryGET,
    categoryGET,
    editCategoryGET,
    userManagementGET,
    addProductGET,
    productsGET,
    editProductGET,
    ordersGET,
    orderDetailsGET,
    addCouponGET,
    couponsGET,
    dashboardGET,
    salesreportGET
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
    logout,
    addProduct,
    getAllProducts,
    getProduct,
    editProduct,
    listProduct,
    unlistProduct,
    test,
    getOrders,
    updateOrderStatus,
    addCoupon,
    deleteCoupon,
    getorderscount,
    getorderdata,
    getorderdetails,
    downloadSalesreport
} = require("../controllers/adminController.js")

const authenticate = require('../middlewares/auth/adminAuth.js')


router.use((req, res, next)=>{
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    next()
})





//multer
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, '../assets/public/img')
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname)
    }
})
const upload = multer({storage: storage})




//Login
router
.route("/login")
.get(loginGET)
.post(login)


router.use(authenticate)


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
.get(productsGET)

//Add product
router
.route('/panel/products/add')
.get(addProductGET)
.post(upload.array('photo'), addProduct)

//Edit Product
router
.route('/panel/products/edit/:product_id')
.get(editProductGET)
.put(upload.array('photo'),editProduct)

//Delete Product
router
.route('panel/products/delete_product/:product_id')
.delete()


//Get All product
router.get('/get-products', getAllProducts)


//Get one product
router.get('/get-product/:product_id', getProduct)


//list product (UPDATE)
router.put('/list/:product_id', listProduct)

//unlist product (UPDATE)
router.put('/unlist/:product_id', unlistProduct)


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
.route('/panel/orders')
.get(ordersGET)


//order Details
router
.route('/panel/orders/:sub_id')
.get(orderDetailsGET)
.put(updateOrderStatus)

//GET orders
router
.get('/getorders', getOrders)

//sub_orders count
router
.get('/getorderscount', getorderscount)


//===========COUPON==============//

//Add coupon
router
.route('/panel/coupons/add')
.get(addCouponGET)
.post(addCoupon)

//Coupons
router
.route('/panel/coupons')
.get(couponsGET)

//Delete coupon
router
.route('/panel/coupons/delete/:coupon_id')
.put(deleteCoupon)




/**<==== Dash board ===> */
router
.route('/panel/dashboard')
.get(dashboardGET)

router
.route('/orderdata/:based_on')
.get(getorderdata)


/**<==== Sales Report ===> */

router
.route('/panel/dashboard/salesreport')
.get(salesreportGET)

router
.post('/orderdetails/:based_on', getorderdetails)

//download pdf 
router
.get('/salesreport/download', downloadSalesreport)


//Logout
router
.route('/logout')
.delete(logout)

//Test
router
.route('/page')
.get(test)

router.all("*", (req, res)=>{
    res.status(404).render('pagenotfound', {fromAdmin: true})
})

module.exports = router;
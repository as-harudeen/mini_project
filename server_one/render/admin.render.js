const jwt = require('jsonwebtoken')
const CategoryModel = require('../../models/categoryModel.js')
const ProductModel = require('../../models/product.model.js')
const OrderModel = require('../../models/orderModel.js')
const UserModel = require('../../models/userModel.js')
const moment = require('moment')


//@des http:localhost:3000/admin/login
const loginGET = (req, res)=>{
    const token = req.cookies.adminToken
    if(!token) return res.render('admin_login')

    const admin = jwt.verify(token, process.env.SUPER_SECRET)
    if(!admin) return res.render('admin_login')

    res.status(200).redirect("/admin/panel/category")
}

//@des http:localhost:3000/admin/panel
const panelGET = (req, res)=>{
    res.status(200).send("Admin panel")
}


/**=================CATEGORY GET============== */

//@des http:localhost:3000/admin/panel/category
const categoryGET = (req, res)=>{
    res.status(200).render('admin_category')
}

//@des http:localhost:3000/admin/panel/category/add
const addCategoryGET = (req, res)=>{
    res.status(200).render('admin_addCategory')
}

//@des http:localhost:3000/admin/panel/category/edit/:category_name
const editCategoryGET = async (req, res)=>{
    
    const category_name = req.params.category_name
    
    console.log(category_name)
    try{
        
        const category = await CategoryModel.findOne({category_name})
        if(!category) return res.status(400).send("category not exits")
        
        res.status(200).render('admin_editCategory', {category})
        
    } catch (err) {
        console.log(err.message)
        return res.status(500).send(err.message)
    }
}

/**=================USER GET============== */

//@des http:localhost:3000/admin/panel/user_management
const userManagementGET = async (req, res)=>{
    res.status(200).render('admin_userManagement')
    
}


/**=================PRODUCT GET============== */

//@des http:localhost:3000/admin/panel/products/add
const addProductGET = async (req, res)=>{
    res.status(200).render('admin/addProduct')
}

//@des http:localhost:3000/admin/panel/products
const productsGET = async(req, res)=>{
    const products = await ProductModel.find()
    res.status(200).render('admin/products', {products})
}


//@des http:localhost:3000/admin/panel/products/edit/:product_id
const editProductGET = async (req, res)=>{
    const productId = req.params.product_id
    console.log(productId)
    const product = await ProductModel.findById(productId)
    console.log(product)
    res.status(200).render('admin/editProduct', {product})
}


//@des http/localhost:3000/admin/panel/orders
const ordersGET = async (req, res)=>{
    res.status(200).render('admin/orders')
}


//@des http://localhost:3000/amdin/panel/orders/:order_id
const orderDetailsGET = async (req, res)=>{
    const {order_id} = req.params
    const fetchedOrders = req.session.orders

    if(!fetchedOrders) return res.redirect('/admin/panel/orders')
    const currOrder = fetchedOrders[order_id]
    if(!currOrder) return res.redirect('/admin/panel/orders')

    const orderedOn = moment(currOrder.createdAt).format('DD/MM/YYYY')
    const deliveryDate = moment(currOrder.delevery_date).format('DD/MM/YYYY')

    res.status(200).render('admin/orderDetails', {order: currOrder, orderedOn, deliveryDate})
}


module.exports = {
    loginGET,
    panelGET,
    categoryGET,
    addCategoryGET,
    editCategoryGET,
    userManagementGET,
    addProductGET,
    productsGET,
    editProductGET,
    ordersGET,
    orderDetailsGET
}

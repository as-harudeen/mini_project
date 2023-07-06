const ProductModel = require('../../models/product.model.js')
const UserModel = require('../../models/userModel.js')
const CategoryModel = require('../../models/categoryModel.js')
const OrderModel = require('../../models/orderModel.js')
const jwt = require('jsonwebtoken')


//@des http:localhost:3000/api/register
const registerGET = (req, res)=>{
    res.status(200).render('user_register', {user: 'achu'})
}
//@des http:localhost:3000/api/login
const loginGET = (req, res)=>{
    res.status(200).render('user_login')
}

//@des http:local:3000/api/products
const productGET = async (req, res)=>{
    const product = await ProductModel.findOne()
    const user = await UserModel.findOne()
    res.render('user/productView', {product})

}

//@des http:localhost:3000/api/products/:product_id
const productDetailGET = async (req, res)=>{
    const {product_id} = req.params
    const product = await ProductModel.findById(product_id)
    res.status(200).render('user/productView', {product})
}


//@des http:local:3000/api/
const homeGET = async (req, res)=>{
    const data = await ProductModel.find()
    res.status(200).render('user/home', { log: "LogOut", title: "Home", user: "Achu", data, cartCount: 5 })
}


//@des http:localhost:3000/api/shop/
const shopGET = async (req, res)=>{
    const product = await ProductModel.find({ isDeleted: false }).skip(0).limit(3);
    const category = await CategoryModel.find()
    res.render('user/shop', { title: "shop", user: "Achu", cartCount: 5, product, category, totalPages: 20, currentPage: 2   })
}


//@des http:localhost:3000/api/cart
const cartGET = async (req, res)=>{
    res.status(200).render('user/cart')
}

//@des http:localhost:3000/api/profile
const profileGET= async (req, res)=>{
    const user = await UserModel.findOne({_id: req.user.userId})
    res.status(200).render('user/profile', {userData: user})
}

//@des http://localhost:3000/api/profile/address
const addressGET = async (req, res)=>{
    const user = await UserModel.findOne({_id: req.user.userId})
    res.status(200).render('user/address', {userAddress: user.address, userData: user})
}


//@des http://localhost:3000/api/profile/address/edit/:address_id
const editAddressGET = async (req, res)=>{
    const {address_id} = req.params
    const {userId} = req.user
    try {
        const data = await UserModel.findOne({_id: userId, 'address._id': address_id},
            { 'address.$': 1, _id: 0 })
            console.log(data.address[0], " ithu nanana")
        res.status(200).render('user/edit_address', {address:  data.address[0]})
    } catch (err) {
        console.error(err.message)
        res.status(500).send(err.message)
    }
}


//@des http://localhost:3000/api/checkout?products="[]"
const checkoutGET = async (req, res)=>{

    //Redirecting to a home page when user try to access checkout directly
    if(!req.query.products) return res.status(400).redirect('/api')

    try {
        
        const products = JSON.parse(req.query.products)
        //Redirection if the data not valide
        if(typeof products != 'object') return res.status(400).redirect('/api')
        //Redirection if the data is empty
        if(!products[0]) return res.status(400).redirect('/api')

        console.log(products)

        /**
         [
            {
                product_id: id......,
                color: black,
                size: M,
                quantity: 1
            }
         ]
         */

         //intializig array for store data
        const data = []
        const checkoutData = []
        for(let productOBJ of products){//Itrating through all products


            checkoutData.push({
                product_id: productOBJ.product_id,
                color: productOBJ.color,
                size: productOBJ.size,
                quantity: productOBJ.quantity,
            })

            //validating products array
            if(!productOBJ.product_id) throw new Error("product Not valid")
            if(!productOBJ.color) throw new Error("product Not valid")
            if(!productOBJ.size) throw new Error("product Not valid")
            if(!productOBJ.quantity) throw new Error("product Not valid")

            //take some nessesary data
            const product  = await ProductModel.findById(
                productOBJ.product_id,
                {
                    _id: 0, 
                    product_name: 1, 
                    product_price: 1,
                    product_images: {$slice: 1}
                })

            //assigning 
            productOBJ = Object.assign(productOBJ, product.toObject())
            data.push(productOBJ)
        }



        const playload = {
            user: req.user.userId,
            checkoutData
        }
        const orderToken = jwt.sign(playload, process.env.SUPER_SECRET,  {expiresIn: '15m'})
        // console.log(orderToken)
        const expirationTime = new Date(Date.now() + 15 * 60 * 1000); 
        res.cookie('orderToken', orderToken, {expires: expirationTime})

        res.status(200).render('user/checkout',{data})

    } catch (err) {
        if(err instanceof SyntaxError && err.name == 'SyntaxError'){
            console.log("NOT a json")
            return res.status(400).redirect('/api')
        } else {
            console.log(err.message)
            return res.status(500).send(err.message)
        }
    }
}


//@des http://localhost:3000/api/profile/order
const orderGET = async (req, res)=>{
    console.time("orderGET")
    const {userId} = req.user

    try {
        const user = await UserModel.findOne({_id: userId}, {orders: 1, _id: 0})
        const data = []
        for(let orderId of user.orders){

            let order = await OrderModel.findById(orderId.order_id)
            console.log(order)
            const product = await ProductModel.findById(order.product_id, {product_name: 1, _id: 0, product_images: 1, product_price: 1})
            data.push({...order.toObject(), ...product.toObject()})
    
        }


    
        console.timeEnd('orderGET')
        res.status(200).render('user/orders', {data})
    } catch (err) {
        console.log(err.message)
        res.status(500).send(err.message)
    }
}




module.exports = {
    registerGET,
    loginGET,
    productGET,
    homeGET,
    shopGET,
    productDetailGET,
    cartGET,
    profileGET,
    addressGET,
    editAddressGET,
    checkoutGET,
    orderGET
}
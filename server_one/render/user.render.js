const ProductModel = require('../../models/product.model.js')
const UserModel = require('../../models/userModel.js')
const CategoryModel = require('../../models/categoryModel.js')
const OrderModel = require('../../models/orderModel.js')
const CouponModel = require('../../models/coupon.model.js')
const jwt = require('jsonwebtoken')
const moment = require('moment')


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
    try {
        const {product_id} = req.params
        const {userId} = req.user
        const user = await UserModel.findById(userId, {_id: 0, whishlist: 1})
        const product = await ProductModel.findById(product_id)
        const category = await CategoryModel.findOne({category_name: product.category})
        res.status(200).render('user/productView', {product, isInWhishlist: user.whishlist.includes(product_id), offer_price: category.offer_price})
    } catch (err) {
        console.log(err.message)
        return res.status(500).send(err.message)
    }
}


//@des http:local:3000/api/
const homeGET = async (req, res)=>{
   try {
       const data = await ProductModel.find()

       const category_offer = {}
       const categories = await CategoryModel.find({}, {subCategories: 0, _id: 0})
    
       categories.forEach(cate =>{
        category_offer[cate.category_name] = cate.offer_price
       })


       for(let idx in data){
        data[idx] = data[idx].toObject()
        const product = data[idx]
        product.offer_price = category_offer[product.category]
       }
       console.log(data)



       const token = req.cookies.userToken
       if(token){
           const user = jwt.verify(token, process.env.SECRET)
           if(user) return res.status(200).render('user/home', {user: user.userName, data})
       }
   

       res.status(200).render('user/home', {data, categories})

   } catch (err) {
    console.log(err)
       return res.status(500).send(err.message)
   }
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
        res.status(200).render('user/edit_address', {address:  data.address[0]})
    } catch (err) {
        console.error(err.message)
        res.status(500).send(err.message)
    }
}


//@des http://localhost:3000/api/checkout?products="[]"
const checkoutGET = async (req, res)=>{

    const {userId} = req.user
    //Redirecting to a home page when user try to access checkout directly
    if(!req.query.products) return res.status(400).redirect('/api')

    try {
        
        const products = JSON.parse(req.query.products)
        //Redirection if the data not valide
        if(typeof products != 'object') return res.status(400).redirect('/api')
        //Redirection if the data is empty
        if(!products[0]) return res.status(400).redirect('/api')


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
        const products_stocks = {}
        for(let productOBJ of products){//Itrating through all products


            
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
                    product_images: {$slice: 1},
                    product_stock: 1
                })

            //stock validation
            if(products_stocks[productOBJ.product_id] || products_stocks[productOBJ.product_id] == 0) {
                products_stocks[productOBJ.product_id] -=  productOBJ.quantity 
            }   
            else products_stocks[productOBJ.product_id] = product.product_stock - productOBJ.quantity

            if(products_stocks[productOBJ.product_id] < 0) return res.status(500).redirect("/api/cart")

                
            checkoutData.push({
                product_id: productOBJ.product_id,
                color: productOBJ.color,
                size: productOBJ.size,
                quantity: productOBJ.quantity,
                total_price: product.product_price * productOBJ.quantity
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
        const expirationTime = new Date(Date.now() + 15 * 60 * 1000); 
        res.cookie('orderToken', orderToken, {expires: expirationTime})

        const user = await UserModel.findById(userId, {wallet: 1, _id: 0})
        res.status(200).render('user/checkout',{data, wallet: user.wallet})

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
    const orderHist = await OrderModel.find()
    res.status(200).render('user/orders')
}


//@des http://localhost:3000/api/profile/order/:order_id/:sub_order_id
const orderViewGET = async (req, res)=>{
    const {userId} = req.user
    const {order_id, sub_order_id} = req.params
    try {

        const user = await UserModel.findOne({_id: userId, orders: {"$elemMatch": {$eq: order_id}}}, {_id: 0})
        if(!user) return res.status(403).send("Forbiden")

        const order = await OrderModel.findOne({_id: order_id, "sub_orders._id": sub_order_id}, 
        {"sub_orders.$": 1, createdAt: 1, address: 1, payment_method: 1})
        const product = await ProductModel.findById(order.sub_orders[0].product_id, {
            product_name: 1,
            product_des: 1,
            product_images: 1,
            _id: 0
        })
    
        const orderedOn = moment(order.createdAt).format('DD/MM/YYYY')
        const expectedDate = moment(order.sub_orders[0].delivery_date).format('DD/MM/YYYY')
        // const address = await UserModel.findOne({_id: userId, 'address._id': order.address}, {'address.$': 1, _id: 0})
    
        res.status(200).render('user/orderView', {order: {...order.toObject(), ...product.toObject()}, orderedOn, expectedDate, address: order.address})
        // res.status(200).render('user/orderView', {address: {}, order: {}, orderedOn: 1, expectedDate: 3})
    } catch (err) {
        console.log(err.message)
        return res.status(500).send(err.message)
    }
}



//@des http://localhost:3000/api/wihshlist
const whishlistGET = async (req, res)=>{
    const {userId} = req.user
    try{
        const user = await UserModel.findById(userId, {_id: 0, whishlist: 1})
        const products = await ProductModel.find({_id: {$in: user.whishlist}})
        res.status(200).render("user/whishlist", {productDetails: products})
    } catch (err) {
        return res.status(500).send(err.message)
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
    orderGET,
    orderViewGET,
    whishlistGET
}
const bcrypt = require('bcrypt')
const ProductModel = require('../models/product.model.js')
const UserModel = require('../models/userModel.js')
const OrderModel = require('../models/orderModel.js')
const CouponModel = require('../models/coupon.model.js')


///rest/get-products
//QUERY   option & sort
const getProducts = async(req, res)=>{
    try {
        const option = JSON.parse(req.query.option);
        option.isDeleted = false;
        const sort = JSON.parse(req.query.sort);
        const pagination = JSON.parse(req.query.pagination);

        const products = await ProductModel.find(option, null, pagination).sort(sort);
        res.status(200).send(products)

    } catch (err) {
        console.log(err.message)
        res.status(500).send(err.message)
    }
}


//localhost:5000/cart
//method GET
const userCart = async(req, res)=>{
    try {
        const {userId} = req.user
        const user = await UserModel.findById(userId, {cart: 1})
        const product_id_arr = user.cart.map(product => product.product_id.toString())
        const products = await ProductModel.find({_id: {$in: product_id_arr}}, {
            product_name: 1,
            product_price: 1,
            product_stock: 1,
            product_images: 1,
            sizes: 1,
            colors: 1
        })

        const productsOBJ = {}//for constant access by Id
        products.forEach(product=> productsOBJ[product._id] = product.toObject())

        const data = []
        user.cart.forEach((item, idx)=>{
            data[idx] = {...item.toObject(), ...productsOBJ[item.product_id]}
        })

        res.status(200).json(data)
    } catch (err) {
        console.log(err.message)
        res.status(500).send(err.message)
    }
}


//localhost:5000/cart/update
//method PUT
const updateCart = async (req, res)=>{
    const {userId} = req.user
    try {
        const findBy = {$and: [{_id: userId}]}

        if(req.query.findBy) {
            findBy.$and.push(JSON.parse(req.query.findBy))
        }

        const option = req.body

        // if(option.isBl)
        await UserModel.updateOne(
            findBy,
            option
            )
        res.status(200).send("Updated")
    } catch (err) {
        console.log(err.message)
        res.status(500).send(err.message)
    }
}

//localhost:5000/profile/update
//method PUT
const updateProfile = async (req, res)=>{
    const {userId} = req.user
    const option = req.body

    const findBy = {$and: [{_id: userId}]}

    if(req.query.findBy) {
        findBy.$and.push(JSON.parse(req.query.findBy))
    }

    try {
        if(option.password){
            const oldPass = await UserModel.findById(userId, {password: 1, _id: 0})
            const checkingOldPass = await bcrypt.compare(option.oldPassword, oldPass.password)
            if(!checkingOldPass) return res.status(400).send("Password incorrect")
            delete option.oldPassword
            option.password = await bcrypt.hash(option.password, 10)
        }
        

        const user = await UserModel.findOneAndUpdate(findBy,option, {returnOriginal: false})
        const data = {...user.toObject()}
        delete data.isBlocked
        delete data.password
        res.status(200).send("Ok")
    } catch (err) {
        if(err.code == 11000){
            return res.status(400).send("already exist")
        }
        res.status(500).send(err)
    }
}



const sanitizingGETUSER = (option)=>{
    if(option.password) delete option.password
    if(option.isBlocked) delete option.isBlocked
    return option
}

//localhost:5000/user
const getUser = async (req, res)=>{
    const {userId} = req.user
    try {
        let option = req.query.option ? JSON.parse(req.query.option) : {}

        //sanitizing
        option = sanitizingGETUSER(option)
        const user = await UserModel.findById(userId, option)
        res.status(200).send(user)
    } catch (err) {
        console.log(err.message)
        res.status(500).send(err.message)
    }
}


//localhost:5000/profile/my_order
const my_order = async (req, res)=>{
    const {userId} = req.user

    try {
        const user = await UserModel.findOne({_id: userId}, {orders: 1, _id: 0});
        const data = []
        const orders = user.orders.reverse();
        const products = {}//memoization
        for(let orderId of orders){
            let order = await OrderModel.findById(orderId)
            order = order.toObject()
            for(let idx in order.sub_orders){
                const item = order.sub_orders[idx]
                if(!products[item.product_id]){
                    const product = await ProductModel.findById(item.product_id, {product_name: 1, _id: 0, product_images: {$slice: 1}})
                    products[item.product_id] = product
                    order.sub_orders[idx] = {...product.toObject(), ...item}
                } else {
                    const product = products[item.product_id]
                    order.sub_orders[idx] = {...product.toObject(), ...item}
                    // data.push({...order.toObject(), ...product.toObject()})
                }
            }
            data.push(order)
        }

    
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
        res.status(500).send(err.message)
    }
}


//localhost:5000/profile/order/cancelrequest/:order_id/:sub_id
const cancelRequest = async (req, res)=>{
    const {order_id, sub_id} = req.params
    const {userId} = req.user

    try {
        const user = await UserModel.findOne({_id: userId, orders: {"$elemMatch": {$eq: order_id}}}, {_id: 0})
        if(!user){
            res.status(403)
            throw new Error("Forbidden")
        }
    
        await OrderModel.updateOne({_id: order_id, "sub_orders._id": sub_id}, {"sub_orders.$.order_status": 'requested for cancel'})
    
        res.status(200).send("OK")
    } catch (err) {
        console.log(err.message)
        return res.status(500).send(err.message)
    }
}


//http://localhost:5000/getcoupons
const getCoupons = async (req, res)=>{
    const {userId} = req.user

    try {
        const coupons = await CouponModel.find({used_users: {$ne: userId}})
        res.status(200).send(coupons)
    } catch (err) {
        return res.status(500).send(err.message)
    }

}



//http:localhost:5000/address/:update
const addressUpdate = async (req, res)=>{
    const {update} = req.params
    const {userId} = req.user
    const option = {}
    if(update == 'add'){
        option.$push = {address: req.body}
    } else if (update == 'delete'){
        option.$pull  = {address: {_id: req.body.address_id}}
    } else return res.status(500).send('Invalid param')

    try {
        const user = await UserModel.findOneAndUpdate({_id: userId}, option, {returnOriginal: false})
        res.status(200).send(user.address)
    } catch (err) {
        console.log(err.message)
        return res.status(500).send(err.message)
    }

}


//http:localhost:5000/whishlist/add/
const addToWhishlist = async (req, res)=>{
    const {product_id} = req.body
    if(!product_id) return res.status(400).send("Product not found")
    const {userId} = req.user
    
    try {
        const product = await ProductModel.findById(product_id)
        if(!product) return res.status(400).send("Product not found")
        await UserModel.updateOne({_id: userId}, {$push: {whishlist: product_id}})

        res.status(200).send("Added")
    } catch (err) {
        return res.status(500).send(err.message)
    }
}

//@des http://localhost:5000/getwhishlist
const getwhishlist = async (req, res)=>{
    const {userId} = req.user
    try {
        const user = await UserModel.findById(userId, {_id: 0, whishlist: 1})
        if(user.whishlist.length){
            const products = await ProductModel.find({_id: {$in: user.whishlist}})
            res.status(200).json(products)
        } else return res.status(200).json([])
    } catch (err) {
        return res.status(500).send(err.message)
    }
}


module.exports = {
    getProducts,
    userCart,
    updateCart,
    updateProfile,
    getUser,
    my_order,
    cancelRequest,
    getCoupons,
    addressUpdate,
    addToWhishlist,
    getwhishlist
}
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const ProductModel = require('../../models/product.model.js')
const UserModel = require('../../models/userModel.js')
const OrderModel = require('../../models/orderModel.js')
const CouponModel = require('../../models/coupon.model.js')


//localhost:5000/get-product
//QUERY   option & sort
const getProduct = async(req, res)=>{
    try {
        const option = JSON.parse(req.query.option)
        const sort = JSON.parse(req.query.sort)
        const pagination = JSON.parse(req.query.pagination)

        const products = await ProductModel.find(option, null, pagination).sort(sort)
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
        console.log(userId)
        const _id = new mongoose.Types.ObjectId(userId)

        let pipeline = [
            {$match: {_id}},
            {
                $lookup: {
                  from: "products",
                  localField: "cart.product_id",
                  foreignField: "_id",
                  as: "cartItems"
                }
            },
            {
                $addFields: {
                  cart: {
                    $map: {
                      input: "$cart",
                      as: "cartItem",
                      in: {
                        $mergeObjects: [
                          "$$cartItem",
                          {
                            $arrayElemAt: [
                              "$cartItems",
                              { $indexOfArray: ["$cartItems._id", "$$cartItem.product_id"] }
                            ]
                          }
                        ]
                      }
                    }
                  }
                }
              },
            // {
            //     $project: {
            //       cart: 1
            //     }
            // }
        ]

        // if(req.query.pipeline){
        //     pipeline = JSON.parse(req.query.pipeline)
        // }
        
        // pipeline.unshift({$match: {_id}})

        const user = await UserModel.aggregate(pipeline);

        res.status(200).json(user)
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
            console.log("Updated")
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


        await UserModel.updateOne(findBy,option)
    
        res.status(200).send(JSON.stringify(option))
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
    console.time("orderGET")
    const {userId} = req.user

    try {
        const user = await UserModel.findOne({_id: userId}, {orders: 1, _id: 0})
        const data = []
        for(let orderId of user.orders){

            let order = await OrderModel.findById(orderId.order_id)
            console.log(order)
            const product = await ProductModel.findById(order.product_id, {product_name: 1, _id: 0, product_images: {$slice: 1}})
            data.push({...order.toObject(), ...product.toObject()})
    
        }

    
        console.timeEnd('orderGET')
        res.status(200).json(data)
    } catch (err) {
        console.log(err.message)
        res.status(500).send(err.message)
    }
}


//localhost:5000/profile/order/cancelrequest/:orderID
const cancelRequest = async (req, res)=>{
    const {orderID} = req.params
    console.log(orderID)
    const {userId} = req.user

    try {
        const user = await UserModel.findOne({_id: userId, 'orders.order_id': orderID})
        if(!user){
            res.status(401)
            throw new Error("Forbiden")
        }
    
        const order = await OrderModel.updateOne({_id: orderID}, {order_status: 'requested for cancel'})
    
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


module.exports = {
    getProduct,
    userCart,
    updateCart,
    updateProfile,
    getUser,
    my_order,
    cancelRequest,
    getCoupons
}
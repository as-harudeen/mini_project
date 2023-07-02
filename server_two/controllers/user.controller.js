const { pipeline } = require('nodemailer/lib/xoauth2/index.js')
const ProductModel = require('../../models/product.model.js')
const UserModel = require('../../models/userModel.js')


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

        let pipeline = []

        if(req.query.pipeline){
            pipeline = JSON.parse(req.query.pipeline)
        }


        pipeline.unshift({$match: {username: 'admin'}})

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

//localhost:5000/update_user/

module.exports = {
    getProduct,
    userCart,
    updateCart
}
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


//localhost:5000/cart/:userId
//method GET
const userCart = async(req, res)=>{
    const {userId} = req.params
    try {
        const user = await UserModel.find(userId)
        console.log(user)
        res.status(200).json(user)
    } catch (err) {
        res.status(500).send(err.message)
    }
}



//localhost:5000/update_user/

module.exports = {
    getProduct,
    userCart
}
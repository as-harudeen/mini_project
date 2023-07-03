const bcrypt = require('bcrypt')
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

        console.log(option)
        await UserModel.updateOne(findBy,option)
    
        res.status(200).send(JSON.stringify(option))
    } catch (err) {
        if(err.code == 11000){
            return res.status(400).send("already exist")
        }
        res.status(500).send(err)
    }
}



//localhost:5000/user
const getUser = async (req, res)=>{
    const {userId} = req.user
    try {
        const option = req.query.option ? JSON.parse(req.query.option) : {}
        const user = await UserModel.findById(userId, option)
        res.status(200).send(user)
    } catch (err) {
        console.log(err.message)
        res.status(500).send(err.message)
    }
}


module.exports = {
    getProduct,
    userCart,
    updateCart,
    updateProfile,
    getUser
}
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const CategoryModel = require('../models/categoryModel.js')
const UserModel = require('../models/userModel.js')



//@des http:localhost:3000/admin/login
//@method POST
/*
{
    admin_name: 'Achu',
    password: 'achubsl'
}
*/
const login = async (req, res)=>{

    try {
        const {admin_email, password} = req.body
    
        console.log(admin_email)
        const db = mongoose.connection.db;
        const root = db.collection('root')
        const data = await root.findOne({})
        console.log(data.admin_email)
        if(data.admin_email !== admin_email) return res.status(400).json({msg: "email not found"})

        const comparePass = await bcrypt.compare(password, data.password)
        if(!comparePass) return res.status(400).json({msg: "Password not match"})  
        
        const token = jwt.sign({
            adminEmail: admin_email,
            adminId: data._id
        }, process.env.SUPER_SECRET , {expiresIn: '24h'})

        res.cookie('adminToken', token, {httpOnly: true})
        res.status(200).send(token)
    } catch (err) {
        return res.status(500).send(err.message)
    }

}

//@des http:locathost:3000/admin/logout
//method DELETE
const logout = async (req, res)=>{
    res.clearCookie('adminToken')
    res.status(200).send("Logout")
}


//@des http:localhost:3000/admin/panel/category/add
//@method POST
/*
{
    "category_name" : "Clothing",
    "subCategories" : ["Shirt", "Pants"]
}
*/
const addCategory = async (req, res)=>{
    const {category_name, subCategories} = req.body

    try {
        const isExist = await CategoryModel.findOne({category_name})
        if(isExist) return res.status(400).send("Category already exist")

        const buildSubCategories = []
        subCategories.forEach((sub)=>{
            buildSubCategories.push({subcategory_name: sub, isDisabled: false})
        })

        const category = await CategoryModel.create({
            category_name,
            subCategories: buildSubCategories
        })
    
        res.status(200).send(`${category}  Created success...`)
    } catch (err) {
        console.log(err.message)
        res.status(500).send(err.message)
    }

}

//@des http:localhost:3000/get-category
//@method GET
const getCategory = async (req, res)=>{
    const {category_name} = req.query
    console.log(category_name)
    // if(!req.user) return res.status(400).send({msg: 'no token'})
    try {
        const condition = {}
        if(category_name) condition.category_name = category_name
        const category = await CategoryModel.find(condition)
        if(category_name && !category) return res.status(400).send("Category not exist")
        res.status(200).send(category)
    } catch (err) {
        console.log(err.message)
        return res.status(500).send(err.message)
    }
}

//@des http:localhost:3000/admin/panel/category/edit/:category_name
//@method PUT
const editCategory = async (req, res)=>{
    const {oldCategory_name, 
        category_name, 
        subCategories
    } = req.body
    

    const buildSubCategories = subCategories.map(sub => {
        return {subcategory_name: sub, isDisabled: false}
    })

     //Checking whether new category name is already exist
    if(category_name !== oldCategory_name){ 
        const isExist = await CategoryModel.findOne({category_name})
        if(isExist) return res.status(400).send('Category already exist')
    }
    
    const filter = {
        category_name: oldCategory_name
    };
    const update = {
        $set: {category_name}, 
        $push: { subCategories: { $each: buildSubCategories } } 
    };
    //Disabling
    await CategoryModel.updateOne(filter, update)


    res.status(200).send("Success")
}


//@des localhost:3000/admin/disable
//method PUT
const disable = async (req, res)=>{
    const {category_name, subcategory_name} = req.body 

    console.log(category_name, subcategory_name)
    try {

        const filter = {
            category_name,
            'subCategories.subcategory_name' : subcategory_name
        }
        const update = {
            $set: { 'subCategories.$.isDisabled': true }
        }

        const cate = await CategoryModel.findOneAndUpdate(filter, update)
        res.status(200).send("Disabled")
    } catch (err) {
        return res.status(500).send(err.message)
    }
}

//@des localhost:3000/admin/disable
//method PUT
const enable = async (req, res)=>{
    const {category_name, subcategory_name} = req.body 

    console.log(category_name, subcategory_name)
    try {

        const filter = {
            category_name,
            'subCategories.subcategory_name' : subcategory_name
        }
        const update = {
            $set: { 'subCategories.$.isDisabled': false}
        }

        const cate = await CategoryModel.findOneAndUpdate(filter, update)
        res.status(200).send("Enabled")
    } catch (err) {
        return res.status(500).send(err.message)
    }
}


//@des localhost:3000/admin/getusers
//method GET
const users = async (req, res)=>{

    try {
        const data = await UserModel.find()
        res.status(200).send(data)
    } catch (err) {
        return res.status(500).send(err.message)
    }
}


//@des localhost:3000/admin/block/:userId
//method put
const block = async (req, res)=>{
    const userId = req.params.userId
    try {
        await UserModel.updateOne({_id: userId}, {isBlocked: true})
        res.status(200).send('blocked')
    } catch (err) {
        return res.status(500).send(err.message)
    }
}



//@des localhost:3000/admin/block/:userId
//method put
const unblock = async (req, res)=>{
    const userId = req.params.userId
    try {
        await UserModel.updateOne({_id: userId}, {isBlocked: false})
        res.status(200).send('unblocked')
    } catch (err) {
        return res.status(500).send(err.message)
    }
}



module.exports = {
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
}
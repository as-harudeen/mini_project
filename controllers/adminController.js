const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const CategoryModel = require('../models/categoryModel.js')



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
        const {admin_email, password, OTP} = req.body
    
        console.log(admin_email)
        const db = mongoose.connection.db;
        const root = db.collection('root')
        const data = await root.findOne({})
        console.log(data.admin_email)
        if(data.admin_email !== admin_email) return res.status(209).send({msg: "email not found"})

        if(req.app.locals.OTP === OTP){

        } else {
            
        }
        const comparePass = await bcrypt.compare(password, data.password)
        if(!comparePass) return res.status(209).send({msg: "Password not match"})
    
        res.status(200).send("Login success")
    } catch (err) {
        return res.status(209).send({msg: "OOPS"})
    }

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
    
        const category = await CategoryModel.create({
            category_name,
            subCategories
        })
    
        res.status(200).send(`${category}  Created success...`)
    } catch (err) {
        console.log(err.message)
        res.status(500).send(err.message)
    }

}

//@des http:localhost:3000/admin/login
//@method POST

module.exports = {
    login,
    addCategory
}
const ProductModel = require('../models/product.model.js')
const UserModel = require('../models/userModel.js')
const CategoryModel = require('../models/categoryModel.js')


//@des http:localhost:3000/api/register
const registerGET = (req, res)=>{
    res.status(200).render('user_register', {user: 'achu'})
}
//@des http:localhost:3000/api/login
const loginGET = (req, res)=>{
    res.status(200).render('user_login')
}

//@des http:local:3000/api/
const productGET = async (req, res)=>{
    const product = await ProductModel.findOne()
    const user = await UserModel.findOne()
    res.render('user/productView', {product})

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



module.exports = {
    registerGET,
    loginGET,
    productGET,
    homeGET,
    shopGET
}
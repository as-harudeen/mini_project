const ProductModel = require('../../models/product.model.js')
const UserModel = require('../../models/userModel.js')
const CategoryModel = require('../../models/categoryModel.js')


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
    editAddressGET
}
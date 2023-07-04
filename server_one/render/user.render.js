const ProductModel = require('../../models/product.model.js')
const UserModel = require('../../models/userModel.js')
const CategoryModel = require('../../models/categoryModel.js')
const {encryptData} = require('../../modules/secure.js')


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


//@des http://localhost:3000/api/checkout?products="[]"
const checkoutGET = async (req, res)=>{

    if(!req.query.products) return res.status(400).redirect('/api')
    
    try {
        console.log("point")
        const products = JSON.parse(req.query.products)
        console.log("point")
        console.log(typeof products)
        if(typeof products != 'object') return res.status(400).redirect('/api')
        console.log("point")
        if(!products[0]) return res.status(400).redirect('/api')
        console.log("point")


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

        const data = []
        for(let productOBJ of products){
            const product  = await ProductModel.findById(
                productOBJ.product_id,
                {
                    _id: 0, 
                    product_name: 1, 
                    product_price: 1,
                    product_images: {$slice: 1}
                })

            productOBJ = Object.assign(productOBJ, product)
            data.push(productOBJ)
        }

        const encrypted = encryptData(JSON.stringify(data), process.env.SUPER_SECRET)

        console.log(encrypted)
        res.status(200).send({data, encrypted})

    } catch (err) {
        if(err instanceof SyntaxError && err.name == 'SyntaxError'){
            console.log("NOT a json")
            return res.status(400).redirect('/api')
        } else {
            return res.status(500).send(err.message)
        }
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
    checkoutGET
}
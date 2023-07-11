const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const CategoryModel = require('../../models/categoryModel.js')
const UserModel = require('../../models/userModel.js')
const ProductModel = require('../../models/product.model.js')
const OrderModel = require('../../models/orderModel.js')
const CouponModel = require('../../models/coupon.model.js')
const sharp = require('sharp')
const moment = require('moment')
const fs = require('fs')


// const redisClient = require('redis').createClient()
// redisClient.connect()
// .then(()=> console.log("conecteddddd"))



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

// const categoryChaching = async (key, categories)=>{
//     for(let category of categories){
//         await redisClient.hSet(key, category.category_name, JSON.stringify(category.subCategories))
//     }
//     console.log("category cached")
// }

//@des http:localhost:3000/admin/get-category
//@method GET
const getCategory = async (req, res)=>{

    let condition = {}
    const {category_name} = req.query
    if(req.query.option) condition = JSON.parse(req.query.option)
    else if(category_name) condition.category_name = category_name

    try {
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

    //filter
    const query = req.query.query ? JSON.parse(req.query.query) : {}
    console.log(query)

    //pagenation
    const {page, limit} = req.query
    const option = {}

    if(page){//building option
        option.limit = +limit
        option.skip = (+page - 1) * 3
    }

    try {
        const data = await UserModel.find(query, null, option)
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


//@des localhost:3000/admin/panel/products/add
//method POST
const addProduct = async (req, res)=>{

    const {
        product_name,
        product_price,
        product_stock,
        product_des,
        category,
        sub_category,
        sizes,
        colors
    } = JSON.parse(req.body.jsonData)

    try {
        const files = req.files


        for(let file of files){
            await sharp(file.path)
            .resize(300, 300)
            .toFile(`${file.path}-cropped`)

            fs.unlinkSync(file.path)
            fs.renameSync(`${file.path}-cropped`, file.path)
        }

        console.log(files)
        if(!files) return res.status(400).send("no file")

        const filenames = files.map(file => file.originalname); // Extract filenames from files array
        const product = await ProductModel.create({
            product_name,
            product_des,
            product_price,
            product_stock,
            category,
            sub_category,
            product_images: filenames,
            sizes,
            colors,
            isDeleted: false
        });
    
        console.log(product)
        res.status(200).send("uploaded")
    } catch (err) {
        console.log(err.message)
        return res.status(500).json(err.message)
    }    
} 


//@des localhost:3000/admin/get-products
//method GET
const getAllProducts = async (req, res)=>{
    try {
        let options = {}
        if(req.query.options) options = JSON.parse(req.query.options)
        console.log(options)
        const data = await ProductModel.find(options)
        res.status(200).json(data)
    } catch (err) {
        console.log(err.message)
        res.status(500).send(err.message)
    }
}


//@des localhost:3000/admin/:productId
//method GET
const getProduct = async (req, res)=>{
    try {
        const {product_id} = req.params
        
        const data = await ProductModel.findById(product_id)
        res.status(200).json(data)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

//@des localhost:3000/admin/panel/products/edit/:product_id
//method PUT
const editProduct = async (req, res)=>{
    try {
        const {product_id} = req.params
        const options = JSON.parse(req.body.jsonData)
        const files = req.files
        const filenames = files.map(file => file.originalname); // Extract filenames from files array
        // const product_images = [...photoCollection_prev, ...filenames]
        const product = await ProductModel.updateOne(
            {_id: product_id},
            options
        )
        console.log(product)
        res.status(200).send("updated")
    } catch (err) {
        console.log(err.message)
        res.status(500).send(err.message)
    }
}

//@des localhost:3000/admin/list/:product_id
//method PUT
const listProduct = async (req, res)=>{
    const product_id = req.params.product_id

    await ProductModel.updateOne(
        {_id: product_id},
        {$set: {isDeleted: false}}
    )

    res.status(200).send("Listed")
}


//@des localhost:3000/admin/unlist/:product_id
//method PUT
const unlistProduct = async (req, res)=>{
    const product_id = req.params.product_id

    await ProductModel.updateOne(
        {_id: product_id},
        {$set: {isDeleted: true}}
    )

    res.status(200).send("Unlisted")
}



//test
const test = async (req, res) => {
    const options = {
       limit: 2,
       skip: 2
    };
 
    const products = await ProductModel.find({}, null, options);
    console.log(products)
    res.send(products)
 }
 


//get orders
const getOrders = async (req, res)=>{
    const {page, limit} = req.query
    const skip = (+page - 1) * +limit


    try {

        const option = req.query.option ? JSON.parse(req.query.option) : {}
        console.log(option)

        const orders = await OrderModel.find(option).limit(+limit).skip(skip)
        
        // console.log(orders)
        
        const producstId = {}//stroring products id for retriving products
        const usersId = {}//storing user id for retriving users
        
        orders.forEach(order => {//building productId and userId
            if(!producstId[order.product_id]) producstId[order.product_id] = true
            if(!usersId[order.user_id]) usersId[order.user_id] = true
        })
        
        //stroting products and users
        const products = await ProductModel.find({_id: {$in: Object.keys(producstId)}}, { 
            product_images: 1, 
            product_name: 1
        })
    const users = await UserModel.find({_id: {$in: Object.keys(usersId)}}, {username: 1})


    const productsOBJ = {}//for constant retrive product by Id
    products.forEach(product=> productsOBJ[product._id] = product.toObject())
    
    const usersOBJ = {}//for constant retrive user by Id
    users.forEach(user => usersOBJ[user._id] = user.toObject())
    
    req.session.orders = {}//storing order data to session storage for reuse
    //by storing order data we don't fetch data again when we check order details
    //of individual
    
    
    //manpulating orders object and add some neccessary data from
    //both products and users
    for (let idx in orders) {
        orders[idx] = orders[idx].toObject()
        const order = orders[idx]
        const product = productsOBJ[order.product_id.toString()];
        const user = usersOBJ[order.user_id.toString()];
        
        order['product_name'] = product.product_name
        order['product_price'] = product.product_price
        order.product_images = product.product_images; 
        order.username = user.username;
        
        req.session.orders[order._id] = order
    }
    
    res.status(200).send(orders)
} catch (err) {
    console.log(err.message)
    return res.status(500).send(err.message)
}
} 


//update order
const updateOrderStatus = async (req, res)=>{
    const {order_id} = req.params
    const status = req.body.status
    
    const option = {$set: {order_status: status}}
    option.$set.isCanceled = status == 'Canceled'
    
    // if(!status || (status != 'Processing' && status != 'Shipped' && status != 'requested for cancel')
    console.log(status)
    if(!status) throw new Error("Status")
    const order = await OrderModel.findByIdAndUpdate(order_id, option)

    let updateQuantity = 0
    
    if((status == 'Return Accepted' && order.order_status != 'Canceled') ||
    (status == 'Canceled' && order.order_status != 'Return Accepted')) updateQuantity = order.quantity
    else if((status != 'Return Accepted' && order.order_status == 'Canceled') ||
    (status != 'Canceled' && order.order_status == 'Return Accepted')) updateQuantity = -order.quantity
    

    if(updateQuantity) await ProductModel.updateOne({_id: order.product_id}, {$inc: {product_stock: updateQuantity}})
    else console.log("no updation")

    res.status(200).send({isCanceled: order.isCanceled, order_status: order.order_status})

}



//@des localhost:3000/admin/panel/coupon/add
//method POST
const addCoupon = async(req, res)=>{
    const {coupon_name, coupon_value, expiry_date} = req.body

    if(coupon_value <= 0) {
        res.status(400)
        throw new Error("coupon value should greater than 0")
    }
    else if(coupon_value >= 1000){
        res.status(400)
        throw new Error("Coupon value can't be more than 999")
    }

    const [year, month, day] = expiry_date.split('-');
    const expiry = new Date(year, month-1, day).getTime()

    const twoDayLater = new Date().getTime() + 2 * 24 * 45 * 60 * 1000

    if(expiry <= twoDayLater) {
        res.status(400)
        throw new Error("Expiry date should be at least 2 day")
    }

    try {
        const coupon = await CouponModel.create({
            coupon_name,
            coupon_value,
            expiry_date
        })
        console.log("coupon added success")

        res.status(200).send(coupon)
    } catch (err) {
        return res.status(400).send("coupon name exist")
    }




}


//@des localhost:3000/admin/panel/coupons/delete/:coupon_id
const deleteCoupon = async(req, res)=>{
    const {coupon_id} = req.params
    const coupon = await CouponModel.findByIdAndDelete({_id: coupon_id})
    if(!coupon) return res.status(400).send("coupon not found")
    res.status(200).send("Deleted")
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
    logout,
    addProduct,
    getAllProducts,
    getProduct,
    editProduct,
    listProduct,
    unlistProduct,
    test,
    getOrders,
    updateOrderStatus,
    addCoupon,
    deleteCoupon
}
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const CategoryModel = require('../models/categoryModel.js')
const UserModel = require('../models/userModel.js')
const ProductModel = require('../models/product.model.js')
const OrderModel = require('../models/orderModel.js')
const CouponModel = require('../models/coupon.model.js')
const BannerModel = require('../models/banner.model.js');
const sharp = require('sharp')
const fs = require('fs');
const PDFDocument = require('pdfkit');


const login = async (req, res)=>{

    try {
        const {admin_email, password} = req.body
    
        const db = mongoose.connection.db;
        const root = db.collection('root')
        const data = await root.findOne({})
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
    const {category_name, subCategories, offer_price} = req.body

    try {
        const isExist = await CategoryModel.findOne({category_name})
        if(isExist) return res.status(400).send("Category already exist")

        const buildSubCategories = []
        subCategories.forEach((sub)=>{
            buildSubCategories.push({subcategory_name: sub, isDisabled: false})
        })

        const category = await CategoryModel.create({
            category_name,
            subCategories: buildSubCategories,
            offer_price
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
        subCategories,
        offer_price
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
        $set: {category_name, offer_price}, 
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


//@des localhost:3000/admin/get-users
//method GET
const users = async (req, res)=>{

    //filter
    const query = req.query.query ? JSON.parse(req.query.query) : {}

    //pagenation
    const {page, limit} = req.query
    const option = {}

    if(page){//building option
        option.limit = +limit
        option.skip = (+page - 1) * 3
    }

    try {
        const data = await UserModel.find(query, null, option);
        res.status(200).send(data);
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

 

//get orders count
const getorderscount = async (req, res)=>{
    try {
        const count = await OrderModel.aggregate([
            { $group: { _id: null, total_count: { $sum: { $size: "$sub_orders" } } } }
        ])

        const total_count = count[0].total_count
        res.status(200).send('' + total_count)
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
} 


//get orders
const getOrders = async (req, res)=>{
    const {page, limit} = req.query
    const skip = (+page - 1) * +limit


    try {

        const option = req.query.option ? JSON.parse(req.query.option) : {}

        // const orders = await OrderModel.find(option).limit(+limit).skip(skip)
        const orders = await OrderModel.aggregate([ { $project: { sub_orders: 1, address: 1, payment_method: 1, user_id: 1 } }, { $unwind: "$sub_orders" }, {$skip: +skip}, { $limit: +limit }])

        const producstId = {}//stroring products id for retriving products
        const usersId = {}//storing user id for retriving users
        
        orders.forEach(order => {//building productId and userId
            if(!usersId[order.user_id]) usersId[order.user_id] = true
            if(!producstId[order.sub_orders.product_id]) producstId[order.sub_orders.product_id] = true
            // order.sub_orders.forEach(sub_order => {
            // })
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
        // orders[idx] = orders[idx].toObject()
        const order = orders[idx]
        const product = productsOBJ[order.sub_orders.product_id.toString()];
        const user = usersOBJ[order.user_id.toString()];
        
        order['product_name'] = product.product_name
        order['product_price'] = product.product_price
        order.product_images = product.product_images; 
        order.username = user.username;
        
        req.session.orders[order.sub_orders._id] = order
    }
    
    res.status(200).send(orders)
} catch (err) {
    console.log(err)
    return res.status(500).send(err.message)
}
} 


//update order
const updateOrderStatus = async (req, res)=>{
    const {sub_id} = req.params
    const status = req.body.status
    
    const option = {$set: {"sub_orders.$.order_status": status}}
    option.$set['sub_orders.$.isCanceled'] = status == 'Canceled'
    
    // if(!status || (status != 'Processing' && status != 'Shipped' && status != 'requested for cancel')
    if(!status) throw new Error("Status")
    const order = await OrderModel.findOneAndUpdate({'sub_orders._id': sub_id}, option)

    let updateQuantity = 0
    
    const sub_order = order.sub_orders[0]
    if((status == 'Return Accepted' && sub_order.order_status != 'Canceled') ||
    (status == 'Canceled' && sub_order.order_status != 'Return Accepted')) {
        updateQuantity = sub_order.quantity
        if(order.payment_method == 'Razorpay'){
            await UserModel.updateOne({_id: order.user_id}, {$inc: {wallet:  Math.round(sub_order.total_price - sub_order.offer_price)}})
        }
    }
    else if((status != 'Return Accepted' && sub_order.order_status == 'Canceled') ||
    (status != 'Canceled' && sub_order.order_status == 'Return Accepted')) updateQuantity = -sub_order.quantity
    

    if(updateQuantity) await ProductModel.updateOne({_id: sub_order.product_id}, {$inc: {product_stock: updateQuantity}})

    res.status(200).send({isCanceled: sub_order.isCanceled, order_status: sub_order.order_status})

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

        res.status(200).send(coupon)
    } catch (err) {
        console.log(err.message)
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


//@des localhost:3000/admin/getSalesdata/:based_on
const getorderdata = async (req, res)=>{
    
    const now = new Date();
    const timeFrame = {
        year: new Date(now.getFullYear(), 0, 1),
        month: new Date(now.getFullYear(), now.getMonth(), 1),
        week: new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
    }

    const {based_on} = req.params
    if(!timeFrame[based_on]) throw new Error("Invalid value on 'based on'")

    const getBy = based_on == 'year' ? '$month' : '$dayOfMonth'

    const aggregationPipeline = buildPipeline(timeFrame[based_on], now, getBy)
    const ordersData = await OrderModel.aggregate(aggregationPipeline);

    const data = []
    const codPayment = []

    //building base of data
    let len = 0;
    if(based_on == 'month') len = Math.floor(now.getDate() / 6)
    else if(based_on == 'week') len = now.getDay()
    else len = now.getMonth()

    
    for(let i = 0; i <= len; i++){
        data.push(0)
        codPayment.push(0)
    }

    for(let order of ordersData){
        let idx;
        if(based_on == 'month') idx = Math.floor(order._id / 6);
        else if(based_on == 'year') idx = order._id - 1;
        else idx = order._id - (now.getDate() - len);
        data[idx] ? data[idx] += order.frequency : data[idx] = order.frequency
        codPayment[idx] ? codPayment[idx] += order.codPayment : codPayment[idx] = order.codPayment
        
    }

    res.status(200).send([data, codPayment])

    function buildPipeline (startDate, endDate, getBy) {
        const aggregationPipeline = [
          {
            $match: {
              createdAt: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: { [getBy]: '$createdAt' },
              totalAmount: { $sum: '$amount' }, // Calculate the total amount for each date
              frequency: { $sum: 1 }, // Count all orders for each date
              codPayment: {
                $sum: {
                  $cond: [{ $eq: ['$payment_method', 'COD'] }, 1, 0], // Count cancelled orders for each date
                },
              }
            },
          },
          {
            $sort: { _id: 1 }, // Sort by date in ascending order (optional)
          },
        ];
      
        return aggregationPipeline;
    };
      
}


//localhost:3000/admin/orderdetails/:based_on
const getorderdetails = async (req, res)=>{
    const {based_on} = req.params;
    const {year, month, week, day} = req.body;
    let start, end;

    if(based_on == "year"){
        start = new Date(+year, 0, 1);
        end = new Date(+year + 1, 0, 1);
    } else if (based_on == "month"){
        start = new Date(+year, +month - 1, 0);
        end = new Date(+year, +month, 0);
    } else if (based_on == 'day'){
        start = new Date(+year, +month - 1, +day);
        end = new Date(+year, +month - 1, +day + 1)
    } else if (based_on == 'week') {
        //validation !month || !week ....
        getWeekDates(year, month, week)
    }


    function getWeekDates(year, month, weekNumber) {
        const firstDayOfMonth = new Date(year, month - 1, 1); // Note: Months are 0-indexed
        const firstDayOfWeek = new Date(firstDayOfMonth);
      
        // Find the first day of the week (Sunday in this case)
        firstDayOfWeek.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());
      
        // Calculate the starting date of the specified week
        start = new Date(firstDayOfWeek);
        start.setDate(start.getDate() + (weekNumber - 1) * 7);
      
        // Calculate the ending date of the specified week (Saturday in this case)
        end = new Date(start);
        end.setDate(end.getDate() + 6);
    }


    try {
        // Function to generate the PDF
        function generatePDF(orderDetails) {
            const doc = new PDFDocument();
            const filename = 'sales_report.pdf';
            const stream = fs.createWriteStream(filename);
          
            doc.pipe(stream);
          
            // Add content to the PDF
            doc.fontSize(18).text('Sales Report - Order Details', { align: 'center' });
          
            // Loop through the order details and add them to the PDF
            let count = 1;
            orderDetails.forEach((order) => {
                order.sub_orders.forEach((sub)=>{
                    doc.moveDown();
                    doc.fontSize(14).text(`Order #${count++}`);
                    doc.fontSize(12).text(`Order ID: ${sub._id}`);
                    doc.fontSize(12).text(`Product Name: ${sub.product_name}`);
                    doc.fontSize(12).text(`Quantity: ${sub.quantity}`);
                    doc.fontSize(12).text(`Customer Name: ${order.username}`);
                    doc.fontSize(12).text(`Total Amount: ${sub.total_price}`);
                    doc.fontSize(12).text(`Payment Method: ${order.payment_method}`);
                    doc.fontSize(12).text(`Order status: ${sub.order_status}`);
                    doc.fontSize(12).text(`Order Date: ${order.createdAt}`);
                    doc.moveTo(50, doc.y + 10).lineTo(550, doc.y + 10).stroke();
                })
            });
            doc.end();
        }

        const pipeline = [
            {
                $match: {
                  createdAt: {
                    $gte: start, // Start of the year
                    $lt: end, // Start of the next year
                  },
                },
            },
            // Lookup stage to join orders with products based on product_id
            {
              $lookup: {
                from: 'products', // Collection name for the products
                localField: 'sub_orders.product_id',
                foreignField: '_id',
                as: 'sub_orders_with_products',
              },
            },
            // Unwind the sub_orders_with_products array to de-normalize the data
            {
              $unwind: '$sub_orders_with_products',
            },
            // Add the product_name field to the sub_orders
            {
              $addFields: {
                'sub_orders.product_name': '$sub_orders_with_products.product_name',
              },
            },
            // Replace the original sub_orders array with the updated sub_orders
            {
              $project: {
                sub_orders_with_products: 0,
              },
            },
            // Lookup stage to join orders with users based on user_id
            {
              $lookup: {
                from: 'users', // Collection name for the users
                localField: 'user_id',
                foreignField: '_id',
                as: 'user',
              },
            },
            // Unwind the user array to de-normalize the data
            {
              $unwind: '$user',
            },
            // Add the username field to the order
            {
              $addFields: {
                username: '$user.username',
              },
            },
            // Project to reshape the final output
            {
              $project: {
                _id: 0,
                user_id: 0,
                user: 0,
              },
            },
        ];
        
        const ordersWithProductDetails = await OrderModel.aggregate(pipeline).exec();


        generatePDF(ordersWithProductDetails);


        res.status(200).send(ordersWithProductDetails)
        
    } catch (err) {
        return res.status(500).send(err.message)
    }
}


//localhost:3000/admin/salesreport/download
const downloadSalesreport = (req, res)=>{
    const filePath = 'sales_report.pdf'
  
    // Set the appropriate headers for downloading the file
    res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent('sales_report.pdf')}`);
    res.setHeader('Content-Type', 'application/pdf');
  
    // Stream the PDF file to the response
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
}


//localhost:3000/admin/panel/banner/add
//method POST
const banner = async (req, res) => {
    try {
        const {img} = req.body;
        await BannerModel.create({
            banner_url: img
        })
        res.status(200).send("Added");
    } catch (err) {
        return res.status(500).send(err);
    }
}

//localhost:3000/admin/getbanners
//method GET
const getBannerDetails = async (req, res) => {
    try {
        const banners = await BannerModel.find();
        res.status(200).json(banners);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

//delete banner
const deleteBanner = async (req, res) => {
    const {id} = req.params;
    try {
        await BannerModel.deleteOne({_id: id});
        return res.status(200).send("Deleted");
    } catch (er) {
        return res.status(500).send(er)
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
    logout,
    addProduct,
    getAllProducts,
    getProduct,
    editProduct,
    listProduct,
    unlistProduct,
    getOrders,
    updateOrderStatus,
    addCoupon,
    deleteCoupon,
    getorderscount,
    getorderdata,
    getorderdetails,
    downloadSalesreport,
    banner,
    getBannerDetails,
    deleteBanner
}
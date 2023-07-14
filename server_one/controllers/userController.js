const UserModel = require('../../models/userModel.js');
const ProductModel = require('../../models/product.model.js')
const OrderModel = require('../../models/orderModel.js')
const CouponModel = require('../../models/coupon.model.js')
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken')
const { getDb } = require('../../database/db.js')
const sendMail = require('../controllers/mailer.js')
const Razorpay = require('razorpay')
const env = process.env

const razorpayInstence = new Razorpay({
    key_id: env.RAZOR_KEY_ID,
    key_secret: env.RAZOR_KEY_SECRET
})
// const {LocalStorage} = require('node-localstorage')
// const {decryptData} = require('../../modules/secure.js')


// const localStorage = new LocalStorage('../config')


//@des http:localhost:3000/api/register
//@method POST
/*
{
    username: 'Achu',
    credantial: 'achucoading@gmail.com',
    password: 'achubsl',
    confirm_password: 'achubsl'
}
*/
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!req.app.locals.OTPVerified) return res.status(400).send('OTP verification is required..')
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await UserModel.create({
            username,
            email,
            password: hashedPassword,
            isBlocked: false
        })

        console.log(user, " created success")
        req.app.locals.OTPVerified = null
        res.status(201).json('Register success')
    } catch (err) {
        console.log(err.message)
        res.status(500).send(err.message)
    }
}


//@des http:localhost:3000/api/login
//@method POST
/*
{
    credantial: 'achucoading@gmail.com',
    password: 'achubsl',
}
*/
const loginWithPass = async (req, res) => {
    try {
        const { email, password, OTP } = req.body
        if (!password && !OTP) return res.status(400).json({ err: "OTP or password is mandatory" })
        const user = await UserModel.findOne({ email })

        let OTPVerified = false
        let compare = false
        if (OTP) {
            OTPVerified = OTP == req.app.locals.OTP
        } else {
            compare = await bcrypt.compare(password, user.password)
        }



        if (!OTPVerified && !compare) return res.status(400).json({ err: "Incorrect password and OTP" })


        const token = jwt.sign({
            userId: user._id,
            userName: user.username
        }, env.SECRET, { expiresIn: '24h' })

        res.cookie('userToken', token)
        res.status(200).send(token)
    } catch (err) {
        console.log(err.message)
        return res.status(500).json("Internal error")
    }
}


//Get user data
//@des localhost:3000/api/get-user
//mehod post
const getUser = async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await UserModel.findOne({ $or: [{ username }, { email }] });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).send(err.message);
    }
};


//Generate OTP
//@des localhost:3000/api/generate-otp/:email
//method get
const generateOTP = async (req, res) => {

    const { email } = req.params

    req.app.locals.OTP = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    })

    await sendMail("Email Verification", `Your OTP is ${req.app.locals.OTP}`, email)

    setTimeout(() => req.app.locals.OTP = '', 60000)
    res.status(201).send("OTP Sended")
}



//Verify OTP
//@des localhost:3000/api/verify-otp
//mehod POST
const verifyOTP = (req, res) => {
    const { OTP } = req.body
    console.log(OTP)
    console.log(req.app.locals.OTP)
    if (OTP === req.app.locals.OTP) {
        req.app.locals.OTP = null
        req.app.locals.OTPVerified = true
        res.status(200).send("success")
    }
    else {
        req.app.locals.OTPVerified = false
        res.status(400).send("no match")
    }
}



//Document Count
//@des localhost:3000/api/doc_count/:collection
//method GET

const count = async (req, res) => {
    const option = req.query.option ? JSON.parse(req.query.option) : {}
    const { collection } = req.params
    const db = await getDb()
    try {
        const count = await db.collection(collection).countDocuments(option)
        res.status(200).send(String(count))
    } catch (err) {
        res.status(500).send(err.message)
    }
}


//Confirm Order
//@des localhost:3000/api/order
//method POST
const order = async (req, res) => {

    const { checkoutData } = req.order//take the checkoutdata
    console.log(checkoutData)
    const { address_id, payment_method, coupon_id } = req.body //taking address, payment method and coupon id
    const { userId } = req.user


    const address = await UserModel.findOne({ _id: userId, 'address._id': address_id }, { 'address.$': 1 })
    if (!address) throw new Error('Invalid address..')

    console.log(address)
    if (payment_method != 'COD' && payment_method != 'Razorpay') return res.status(400).send("invalid payment method")

    const productQuantity = {}//for update product orderedcount
    checkoutData.forEach(product => {
        //taking the count
        if (productQuantity[product.product_id]) productQuantity[product.product_id] += product.quantity
        else productQuantity[product.product_id] = product.quantity

    })

    for (let product_id in productQuantity) {
        const product = await ProductModel.findById(product_id, { product_stock: 1, _id: 0 })
        if (product.product_stock < productQuantity[product_id]) return res.status(400).send("Stock not available")
        else console.log("availble")
    }



    let discount_price = 0
    // let totalProduct = checkoutData.length
    if (coupon_id) {//checking coupon is valid or not
        const coupon = await CouponModel.findOneAndUpdate({ _id: coupon_id, used_users: { $ne: userId } }, { $push: { used_users: userId } })
        if (coupon) {
            const isThisCouponAllowed = (total_price * .15) >= coupon.coupon_value//put a restriction to avoid coupon missuse
            if (isThisCouponAllowed) {
                discount_price = coupon.coupon_value
            }
        }
    }

    try {

        const orders = await OrderModel.create({
            user_id: userId,
            sub_orders: checkoutData,
            address: {
                name: address.address[0].full_name,
                house_name: address.address[0].house_name,
                street: address.address[0].street,
                city: address.address[0].city,
                phone: address.address[0].phone,
                pincode: address.address[0].pincode
            },
            payment_method,
            discount_price
        })

        const query = { $push: {orders: orders._id} }
        if (req.query.fromCart) query.$unset = { cart: "" }
        await UserModel.updateOne({ _id: userId }, query)

        for (let _id in productQuantity) {//incresing orderedcount
            await ProductModel.findByIdAndUpdate(_id, { $inc: { orderedCount: productQuantity[_id], product_stock: -productQuantity[_id] } })
        }

        res.status(200).json("OK")
    } catch (err) {
        console.log(err.message)
        return res.status(500).send(err.message)
    }
}



//Razorpay createorder
//@des localhost:3000/razorpay/createOrder
//method POST
const createOrder = async (req, res) => {
    const { checkoutData } = req?.order
    if (!checkoutData) return res.status(400).send("No checkout details")

    try {
        let amount = 0
        for (let product of checkoutData) {
            amount += product.total_price
        }
        console.log(amount)

        const order = await razorpayInstence.orders.create({
            amount: amount * 100,
            currency: 'INR',
            receipt: 'achuBSL'
        })
        order.key_id = env.RAZOR_KEY_ID
        res.status(200).send(order)


    } catch (err) {
        console.log(err.message)
        return res.status(500).send(err.message)
    }

}

//@des localhost:3000/api/logout
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err)
        } else {
            res.clearCookie('userToken')
            res.redirect("/api")
        }
    })
}

//@des localhost:3000/api/wisilist




const redis = require('redis');
const { connect, connection } = require('mongoose');
const client = redis.createClient();
client.connect()
    .then(() => console.log("connected"))
    .catch(err => console.log(err.message))


const red = async (req, res) => {

    try {
        const username = 'achu'

        const inRedis = await client.hGet("sample", username)
        // if(inRedis)return res.send(JSON.parse(inRedis))
        const user = await UserModel.findOne({ username })
        console.log(user)
        await client.hSet("sample", username, JSON.stringify(user))
        await client.expire('sample', 10)
        res.send("hj")
    } catch (err) {
        console.log(err.message)
        res.send("internal error")
    }
}


module.exports = {
    register,
    loginWithPass,
    getUser,
    generateOTP,
    verifyOTP,
    count,
    red,
    order,
    createOrder,
    logout
}
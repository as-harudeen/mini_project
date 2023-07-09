const UserModel = require('../../models/userModel.js');
const ProductModel = require('../../models/product.model.js')
const OrderModel = require('../../models/orderModel.js')
const CouponModel = require('../../models/coupon.model.js')
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken')
const {getDb} = require('../../database/db.js')
const sendMail = require('../controllers/mailer.js')
const env = process.env
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
const register = async(req, res)=>{
    try {
        const {username, email, password} = req.body

        if(!req.app.locals.OTPVerified) return res.status(400).send('OTP verification is required..')
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
const loginWithPass = async (req, res)=>{
    try {
        const {email, password, OTP} = req.body
        if(!password && !OTP) return res.status(400).json({err: "OTP or password is mandatory"})
        const user = await UserModel.findOne({email})

        let OTPVerified = false
        let compare = false
        if(OTP){
            OTPVerified = OTP == req.app.locals.OTP
        } else {
            compare = await bcrypt.compare(password, user.password)
        }



        if(!OTPVerified && !compare)return res.status(400).json({err: "Incorrect password and OTP"})


        const token = jwt.sign({
            userId: user._id,
            userName: user.username
        }, env.SECRET, {expiresIn: '24h'})

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
  const generateOTP = async (req, res)=>{

    const {email} = req.params

    req.app.locals.OTP = otpGenerator.generate(6, {
        lowerCaseAlphabets: false, 
        upperCaseAlphabets: false, 
        specialChars: false   
      })

      await sendMail("Email Verification", `Your OTP is ${req.app.locals.OTP}`, email)
    
      setTimeout(()=> req.app.locals.OTP = '', 60000)
      res.status(201).send("OTP Sended")
  }

  

  //Verify OTP
  //@des localhost:3000/api/verify-otp
  //mehod POST
  const verifyOTP = (req, res)=>{
    const {OTP} = req.body
    console.log(OTP)
    console.log(req.app.locals.OTP)
    if(OTP === req.app.locals.OTP) {
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

const count = async (req, res)=>{
    const option = req.query.option ? JSON.parse(req.query.option) : {}
    const {collection} = req.params
    const db = await getDb()
    try {
        const count = await db.collection(collection).countDocuments(option)
        res.status(200).send(String(count))
    } catch (err) {
        res.status(500).send(err.message)
    }
}


//Confirm SOrder
//@des localhost:3000/api/order
//mthod POST
const order = async (req, res)=>{

    const {checkoutData} = req.order//take the checkoutdata
    const {address_id, payment_method, coupon_id} = req.body //taking address, payment method and coupon id
    const {userId} = req.user
    
    const address = await UserModel.findOne({_id: userId, 'address._id': address_id}, {'address.$': 1})
    console.log(address)
    if(!address) throw new Error('Invalid address..')

    let dis_amount = 0
    let totalProduct = checkoutData.length
    if(coupon_id){
        const coupon = await CouponModel.findOneAndUpdate({_id: coupon_id, used_users: {$ne: userId}}, {$push: {used_users: userId}})
        if(coupon){
            if(totalProduct >= coupon.coupon_value) dis_amount = 1
            else dis_amount = Math.floor(coupon.coupon_value / checkoutData.length)
        }
    }

    //Assigning address and payment method with products
    for(let product of checkoutData){
        product.user_id = userId,
        product.address = address.address[0],
        product.payment_method = payment_method,
        product.discount_price = dis_amount
        totalProduct--
        if(totalProduct <= 0) dis_amount = 0
    }

    console.log(checkoutData)


    try {

        const orders = await OrderModel.insertMany(checkoutData)
        
        const orderId = []//for adding to user's orders field
        const productCount = {}//for update product orderedcount
        orders.forEach(order => {
            //taking the count
            if(productCount[order.product_id]) productCount[order.product_id] += order.quantity
            else productCount[order.product_id] = order.quantity
            orderId.push({order_id: order._id})//collecting as a order_id

        })
        if(req.query.fromCart){ //clearing cart and adding all order Id to user model
            await UserModel.updateOne({_id: userId}, {$unset: {cart: ""}, $push: {
                orders: {$each: orderId}
            }})
        }

        for(let _id of Object.keys(productCount)){//incresing orderedcount
            await ProductModel.findByIdAndUpdate(_id, {$inc: {orderedCount: productCount[_id]}})
        }

        res.status(200).json("OK")
    } catch (err) {
        console.log(err.message)
        return res.status(500).send(err.message)
    }
} 




const redis = require('redis');
const { connect, connection } = require('mongoose');
const client = redis.createClient();
  client.connect()
  .then(()=>console.log("connected"))
  .catch(err => console.log(err.message))


const red = async(req, res)=>{
    
    try {
        const username = 'achu'

        const inRedis = await client.hGet("sample",username)
        // if(inRedis)return res.send(JSON.parse(inRedis))
        const user = await UserModel.findOne({username})
        console.log(user)
        await client.hSet("sample",username, JSON.stringify(user))
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
    order
}
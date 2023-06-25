const UserModel = require('../../models/userModel.js');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken')


const env = process.env




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
        const {email, password} = req.body
        if(!email || !password) return res.status(400).json({err: "email and password is mandatory"})
        const user = await UserModel.findOne({email})
        const compare = await bcrypt.compare(password, user.password)
        if(!compare)return res.status(400).json({err: "Incorrect password"})


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

//@des http:localhost:3000/api/login-otp
//@method POST
/*
{
    credantial: 'achucoading@gmail.com',
    password: 'achubsl',
}
*/
const loginWithOTP = async (req, res)=>{
    try {
        const {email} = req.body
        if(!req.app.locals.OTPVerified) return res.status(400).send("OTP not verified..")
        const user = await UserModel.findOne({email})

        const token = jwt.sign({
            userId: user._id,
            userName: user.username,
        }, env.SECRET, {expiresIn: '24h'})

        res.cookie('userToken', token)
        res.status(200).send(token)
    } catch (err) {
        return res.status(500).send("Internal error")
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
  //@des localhost:3000/api/generate-otp
  //method get
  const generateOTP = (req, res)=>{
    req.app.locals.OTP = otpGenerator.generate(6, {
        lowerCaseAlphabets: false, 
        upperCaseAlphabets: false, 
        specialChars: false   
      })
    
      setTimeout(()=> req.app.locals.OTP = '', 60000)
      res.status(201).send({OTP: req.app.locals.OTP})
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

const redis = require('redis')
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
    loginWithOTP,
    red
}
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
require('dotenv').config({path: '../.env'});
const {connect} = require('../database/db.js')
const session = require('express-session')


//Database connecting
connect()



const app = express();
const port = process.env.PORT || 3001;

//Using parse midleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(cors())


//Using midlewares
app.use(morgan('tiny'))
app.use(cookieParser())
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  }));

//Setting static files
app.use("/css", express.static(path.resolve(__dirname, '../assets/css')));
app.use("/js", express.static(path.resolve(__dirname, '../assets/js')));
app.use("/public", express.static(path.resolve(__dirname, '../assets/public')));

//Seting view engine
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'ejs')


//Using routers
app.use("/api", require('./routers/userRoutes.js'));
app.use("/admin", require('./routers/adminRoutes.js'));



// const Redis = require('redis')
// const redisClient = Redis.createClient()
// redisClient.connect()
// .then(()=> console.log("conected"))
// const category = {
//     category_name: 'Clothing',
//     subcategories: ['a', 'b', 'c', 'd', 'e']
// }

// async function set (){
//     await redisClient.hSet("categories", category.category_name, JSON.stringify(category.subcategories))
// }
// set()

// async function get (){
//     const data = await redisClient.HGETALL('categories', category.category_name)
//     console.log(Object.keys(data))
// }
// get()





app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})
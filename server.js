const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
require('dotenv').config();

//connect to data base
mongoose.connect('mongodb://127.0.0.1:27017/mini-project')
.then(()=>{
    console.log("Database connected....")
})
.catch(err =>{
    console.log(err.message)
})


const app = express();
const port = process.env.PORT || 3001;

//Using parse midleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Using midlewares
app.use(morgan('tiny'))
app.use(cookieParser())

//Setting static files
app.use("/css", express.static(path.resolve(__dirname, 'assets/css')));
app.use("/js", express.static(path.resolve(__dirname, 'assets/js')));

//Seting view engine
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
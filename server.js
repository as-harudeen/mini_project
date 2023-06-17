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


app.get('/a/:id', (req, res)=>{
    const id = req.params.id
    res.send(id)
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})
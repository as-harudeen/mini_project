const express = require('express');
const path = require('path');
const morgan = require('morgan')
require('dotenv').config();


const app = express();
const port = process.env.PORT || 3001;

//Using parse midleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Using midlewares
app.use(morgan('tiny'))

//Setting static files
app.use("/css", express.static(path.resolve(__dirname, 'assets/css')));
app.use("/js", express.static(path.resolve(__dirname, 'assets/js')));

//Seting view engine
app.set('view engine', 'ejs')


//Using routers
app.use("/api", require('./routers/userRoutes.js'));
// app.use("/api/admin", require('./routers/adminRoutes.js'));


app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})
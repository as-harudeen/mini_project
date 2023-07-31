const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
require('dotenv').config();
const {connect} = require('./database/db.js')
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
app.use("/css", express.static(path.resolve(__dirname, './assets/css')));
app.use("/js", express.static(path.resolve(__dirname, './assets/js')));
app.use("/public", express.static(path.resolve(__dirname, './assets/public')));

//Seting view engine
app.set('view engine', 'ejs')


//Using routers
app.use("/api", require('./routers/userRoutes.js'));
app.use("/admin", require('./routers/adminRoutes.js'));
app.use("/rest/", require('./routers/restApiRoutes.js'));
// app.use(errHandler)

app.all('*', (req, res)=> {
  res.status(404).render('pagenotfound')
})



app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})
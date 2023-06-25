const mongoose = require('mongoose')

const connect = async ()=>{
    //connect to data base
    mongoose.connect('mongodb://127.0.0.1:27017/mini-project')
    .then(()=>{
        console.log("Database connected....")
    })
    .catch(err =>{
        console.log(err.message)
    })
}


const getDb = async ()=>{
    const db = mongoose.connection
    return db
}

module.exports = {
    connect,
    getDb
}
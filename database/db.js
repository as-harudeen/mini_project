const mongoose = require('mongoose')

const connect = async ()=>{
    //connect to data base
    mongoose.connect(process.env.CONNECTION_STRING)
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
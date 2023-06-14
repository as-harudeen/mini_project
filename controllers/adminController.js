const mongoose = require("mongoose")
const bcrypt = require('bcrypt')



//@des http:localhost:3000/admin/login
//@method POST


/*
{
    admin_name: 'Achu',
    password: 'achubsl'
}
*/
const login = async (req, res)=>{

    try {
        const {admin_email, password, OTP} = req.body
    
        console.log(admin_email)
        const db = mongoose.connection.db;
        const root = db.collection('root')
        const data = await root.findOne({})
        console.log(data.admin_email)
        if(data.admin_email !== admin_email) return res.status(209).send({msg: "email not found"})

        if(req.app.locals.OTP === OTP){

        } else {
            
        }
        const comparePass = await bcrypt.compare(password, data.password)
        if(!comparePass) return res.status(209).send({msg: "Password not match"})
    
        res.status(200).send("Login success")
    } catch (err) {
        return res.status(209).send({msg: "OOPS"})
    }

}



//@des http:localhost:3000/admin/login
//@method POST

module.exports = {
    login
}
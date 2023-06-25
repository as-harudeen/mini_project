
//Verifying user
const verifyUser = async (req, res, next)=>{
    
    try {
        const {username, email} = req.body
    
        const user = await UserModel.find({$or: [{username}, {email}]})
        if(!user) return res.status(400).json({err: "User not found"})
    
        next()
    } catch (err) {
        return res.status(500).send("Internal error")
    }

}


module.exports = {verifyUser}
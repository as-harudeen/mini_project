const jwt = require('jsonwebtoken')
const UserModel = require('../../models/userModel.js');


const authenticateUser = async (req, res, next)=>{
    try {
        const token = req.cookies.userToken
        if(!token) return res.redirect('/api/login')
        const user = jwt.verify(token, process.env.SECRET)
        if(!user) return res.redirect('/api/login')
        req.user = user
        if(await authorization(user.userId)){
            req.app.locals.user = user.userName
            next()
        } else return res.status(403).redirect('/api/login');
    } catch (err) {
        try {
            res.status(403).redirect('/api/login');
        } catch (err) {
            res.status(500).send(err.message)
        }
    }
}

const authorization = async (userId) => {
    try {
        const user = await UserModel.findOne({_id: userId, isBlocked: false});
        console.log(user);
        return user;
    } catch (err) {
        return false;
    }
}

module.exports = authenticateUser
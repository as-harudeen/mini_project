const jwt = require('jsonwebtoken')

const authenticateAdmin = (req, res, next)=>{
    try {
        console.log("1");
        const token = req.cookies.adminToken
        if(!token) return res.redirect('/admin/login')
        console.log("2");
        
        const admin = jwt.verify(token, process.env.SUPER_SECRET)
        if(!admin) return res.redirect('/admin/login')
        console.log("3");
        req.admin = admin
        console.log("4");
        next()
    } catch (err) {
        console.log(err.message)
        res.status(500).redirect('/admin/login')
    }
}

module.exports = authenticateAdmin

const jwt = require('jsonwebtoken')

const authenticateAdmin = (req, res, next)=>{
    try {
        const token = req.cookies.adminToken
        if(!token) return res.redirect('/admin/login')

        const admin = jwt.verify(token, process.env.SUPER_SECRET)
        if(!admin) return res.redirect('/admin/login')
        req.admin = admin
        next()
    } catch (err) {
        console.log(err.message)
        res.status(500).send(err.message)
    }
}

module.exports = authenticateAdmin

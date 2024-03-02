const jwt = require('jsonwebtoken')

const checkoutAuth = (req, res, next)=>{
    try {
        const token = req.cookies.orderToken
        if(!token) return res.status(400).send("NO Token")
        const playload = jwt.verify(token, process.env.SUPER_SECRET)
        if(!playload) return res.status(400).send("Authentication failed")

        req.order = playload
        next()
    } catch (err) {
        return res.status(500).send(err.message)
    }
}

module.exports = checkoutAuth
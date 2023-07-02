const jwt = require('jsonwebtoken')

const auth = (req, res, next)=>{

    try {
        const token = req.headers.authorization.split(" ")[1]
        if(!token) return res.status(401).send('Unauthorized')

        const user = jwt.verify(token, process.env.SECRET)
        if(!user) return res.status(401).send('Unauthorized')

        req.user = user

        next()
    } catch (err) {
        res.status(500).send(err.message)
    }


}

module.exports = auth
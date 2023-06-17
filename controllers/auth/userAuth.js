const authenticateUser = (req, res, next)=>{
    try {
        const user = jwt.verify(localStorage.token, process.env.SECRET)
        req.user = user

        next()
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports = authenticateUser
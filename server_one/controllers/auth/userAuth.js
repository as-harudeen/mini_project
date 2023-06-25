const authenticateUser = (req, res, next)=>{
    try {
        const token = req.cookies('userToken')
        if(!token) return res.redirect('/api/login')
        const user = jwt.verify(localStorage.token, process.env.SECRET)
        if(!user) return res.redirect('/api/login')
        req.user = user
        next()
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports = authenticateUser
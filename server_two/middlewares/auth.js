const auth = (req, res, next)=>{
    const token = req.cookeis.token
    console.log(token)
    next()
}

module.exports = auth
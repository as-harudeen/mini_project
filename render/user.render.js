//@des http:localhost:3000/api/register
const registerGET = (req, res)=>{
    res.status(200).render('user_register', {user: 'achu'})
}
//@des http:localhost:3000/api/login
const loginGET = (req, res)=>{
    res.status(200).render('user_login')
}

module.exports = {
    registerGET,
    loginGET
}
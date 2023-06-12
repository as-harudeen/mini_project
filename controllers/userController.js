//@des http:localhost:3000/api/register
//@method POST
/*
{
    username: 'Achu',
    credantial: 'achucoading@gmail.com',
    password: 'achubsl',
    confirm_password: 'achubsl'
}
*/
const register = (req, res)=>{
    try {
        const {username, credantial, password} = req.body

        res.status(201).json('Register success')
    } catch (err) {
        res.status(500).send(err.message)
    }
}


//@des http:localhost:3000/api/login
//@method POST
/*
{
    credantial: 'achucoading@gmail.com',
    password: 'achubsl',
}
*/
const login = (req, res)=>{
    res.status(200).send("Login post")
}


const getUser = (req, res)=>{
    try {
        const {username, credantial, password} = req.body

        res.status(200).json({})
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports = {
    register,
    login,
    getUser
}
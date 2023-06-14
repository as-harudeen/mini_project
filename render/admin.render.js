
//@des http:localhost:3000/admin/login
const loginGET = (req, res)=>{
    res.status(200).render("admin_login")
}

//@des http:localhost:3000/admin/panel
const panelGET = (req, res)=>{
    res.status(200).send("Admin panel")
}


module.exports = {
    loginGET,
    panelGET
}

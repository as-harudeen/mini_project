
//@des http:localhost:3000/admin/login
const loginGET = (req, res)=>{
    res.status(200).render("admin_login")
}

//@des http:localhost:3000/admin/panel
const panelGET = (req, res)=>{
    res.status(200).send("Admin panel")
}


//@des http:localhost:3000/admin/panel/category
const categoryGET = (req, res)=>{
    res.status(200).render('admin_category')
}

//@des http:localhost:3000/admin/panel/category/add
const addCategoryGET = (req, res)=>{
    res.status(200).render('admin_addCategory')
}

//@des http:localhost:3000/admin/panel/category/edit
const editCategoryGET = (req, res)=>{
    res.status(200).send('hiihihihihi')
}


module.exports = {
    loginGET,
    panelGET,
    categoryGET,
    addCategoryGET,
    editCategoryGET
}

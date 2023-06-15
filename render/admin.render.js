const CategoryModel = require('../models/categoryModel.js')


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

//@des http:localhost:3000/admin/panel/category/edit/:category_name
const editCategoryGET = async (req, res)=>{

    const category_name = req.params.category_name

    console.log(category_name)
    try{

        const category = await CategoryModel.findOne({category_name})
        if(!category) return res.status(400).send("category not exits")

        res.status(200).render('admin_editCategory', {category})

    } catch (err) {
        console.log(err.message)
        return res.status(500).send(err.message)
    }
}


module.exports = {
    loginGET,
    panelGET,
    categoryGET,
    addCategoryGET,
    editCategoryGET
}

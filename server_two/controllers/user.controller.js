const ProductModel = require('../../models/product.model.js')

//localhost:5000/get-product
//QUERY   option & sort
const getProduct = async(req, res)=>{
    try {
        console.log(req.query)
        const option = JSON.parse(req.query.option)
        const sort = JSON.parse(req.query.sort)

        const products = await ProductModel.find(option).sort(sort)
        res.status(200).send(products)

    } catch (err) {
        console.log(err.message)
        res.status(500).send(err.message)
    }
}


module.exports = {
    getProduct
}
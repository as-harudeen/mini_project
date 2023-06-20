const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    product_des: {
        type: String,
        required: true
    },
    product_price: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    sub_category: {
        type: String,
        required: true
    },
    product_stock: {
        type: Number,
        required: true
    },
    product_images: {
        type: [String],
    },
    payment_methods: {
        type: [String],
        required: true
    }
})

const product = mongoose.model('product', productSchema)

module.exports = product
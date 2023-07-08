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
        type: Number,
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
        required: true
    },
    sizes: {
        type: [String],
        required: true
    },
    colors: {
        type: [String],
        required: true
    },
    orderedCount: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        required: true
    }
}, {timestamps: true})

const product = mongoose.model('product', productSchema)

module.exports = product
const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true
    }, 
    subCategories: {
        type: [Object],
        required: true
    },
    offer_price: {
        type: Number,
        default: 0
    }
})

const category = mongoose.model('category', categorySchema)
module.exports = category
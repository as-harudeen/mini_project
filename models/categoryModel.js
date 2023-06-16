const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true
    }, 
    subCategories: {
        type: [Object],
        required: true
    }
})

const category = mongoose.model('category', categorySchema)
module.exports = category
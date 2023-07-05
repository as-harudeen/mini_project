const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    product_id:{
        type: mongoose.Types.ObjectId,
        required: true
    },
    address_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    order_status: {
        type: String,
        required: true,
        default: 'Processing'
    },
    payment_method: {
        type: String,
        required: true,
        validate: {
            validator: function(value){
                return value === 'COD' || value === 'Razopay'
            },
            message: "Payment should be COD or Razopay"
        }
    },
    payment_status: {
        type: String
    }
}, {timestamps: true})


const orderModel = mongoose.model('orders', orderSchema)

module.exports = orderModel
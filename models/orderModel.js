const mongoose = require('mongoose')

const twoDayLater = ()=>{
    const twoDayMS = 2 * 24 * 60 * 60 * 1000
    return Date.now() + twoDayMS
}


const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    product_id:{
        type: mongoose.Types.ObjectId,
        required: true
    },
    address: {
        type: Object,
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
    total_price: {
        type: String,
        required: true
    },
    discount_price: {
        type: String,
        required: true
    },
    isCanceled: {
        type: Boolean,
        default: false
    },
    delivery_date: {
        type: Date,
        default: twoDayLater

    }
}, {timestamps: true})


const orderModel = mongoose.model('orders', orderSchema)

module.exports = orderModel
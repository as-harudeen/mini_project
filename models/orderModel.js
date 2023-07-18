const mongoose = require('mongoose')

const twoDayLater = ()=>{
    const twoDayMS = 2 * 24 * 60 * 60 * 1000
    return Date.now() + twoDayMS
}

const subOrderSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    total_price: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    order_status: {
        type: String,
        default: "Processing"
    },
    isCanceled: {
        type: Boolean,
        default: false
    },
    offer_price: {
        type: Number,
        default: 0
    },
    delivery_date: {
        type: Date,
        default: twoDayLater
    }
})


const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    sub_orders:{
        type: [subOrderSchema],
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    payment_method: {
        type: String,
        required: true,
        validate: {
            validator: function(value){
                return value === 'COD' || value === 'Razorpay'
            },
            message: "Payment should be COD or Razorpay"
        }
    },
    discount_price: {
        type: Number,
        default: 0
    }
}, {timestamps: true})


const orderModel = mongoose.model('orders', orderSchema)

module.exports = orderModel
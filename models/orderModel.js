const mongoose = require('mongoose')

const twoDayLater = ()=>{
    const twoDayMS = 2 * 24 * 60 * 60 * 1000
    return Date.now() + twoDayMS
}

const productSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    product_price: {
        type: Number,
        required: true
    },
    product_size: {
        type: String,
        required: true
    },
    product_color: {
        type: String,
        required: true
    },
    order_status: {
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
})


const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    products:{

    },
    address: {
        type: Object,
        required: true
    },
    quantity: {
        type: Number,
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
                return value === 'COD' || value === 'Razorpay'
            },
            message: "Payment should be COD or Razorpay"
        }
    },
    discount_price: {
        type: String,
        default: 0
    }
}, {timestamps: true})


const orderModel = mongoose.model('orders', orderSchema)

module.exports = orderModel
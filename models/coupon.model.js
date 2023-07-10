const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    coupon_name: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    coupon_value: {
        type: String,
        require: true
    },
    expiry_date: {
        type: Date,
        require: true
    },
    used_users: {
        type: [mongoose.Types.ObjectId]
    }
})

const coupon =  mongoose.model('coupons', couponSchema)
coupon.ensureIndexes()

module.exports = coupon


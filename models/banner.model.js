const mongoose = require('mongoose');

const fiveDayLater = ()=>{
    const twoDayMS = 5 * 24 * 60 * 60 * 1000
    return Date.now() + twoDayMS
}

const bannerSchema = mongoose.Schema({
    expiry_date: {
        type: Date,
        default: fiveDayLater
    },
    banner_url: {
        type: String,
        required: true,
        unique: true
    }
})

const bannerModel = mongoose.model('banner', bannerSchema);

module.exports = bannerModel;
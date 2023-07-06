const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    full_name: {
      type: String,
      required: true
    },
    house_name: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    phone: {
      type: Number,
      required: true
    },
    pincode: {
      type: String,
      required: true
    }
  })

  module.exports = addressSchema
const mongoose = require('mongoose');
const addressSchema = require('./schema/address.schema.js')


const cartSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
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
  quantity: {
    type: Number,
    required: true
  },
  cart_item_id: {
    type: String,
    required: true
  }
})





const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    type: [cartSchema]
  },
  address: {
    type: [addressSchema]
  },
  orders: {
    type: [mongoose.Types.ObjectId]
  },
  isBlocked: {
    type: Boolean
  },
  whishlist: {
    type: [mongoose.Types.ObjectId],
    unique: true
  },
  wallet: {
    type: Number,
    default: 0
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

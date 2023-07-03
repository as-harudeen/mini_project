const mongoose = require('mongoose');

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
  isBlocked: {
    type: Boolean
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

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
  isBlocked: {
    type: Boolean
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

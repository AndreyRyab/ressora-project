const mongoose = require('../db');

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    unique: true,
  },
  password: String,
  admin: Boolean,
})

module.exports = mongoose.model('user', userSchema);

const mongoose = require('../utils/db');

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Введите пароль'],
    select: false,
  },
  admin: Boolean,
})

module.exports = mongoose.model('user', userSchema);

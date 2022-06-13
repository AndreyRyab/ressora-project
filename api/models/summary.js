const mongoose = require('../db');

const operationSchema = new mongoose.Schema({
  title: String,
  brief: String,
  quantity: Number,
  fact: Boolean,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

const summarySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    unique: true,
    required: true,
  },
  openedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  closedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  plan:  {
    'operations': [
      operationSchema,
    ],
  },
  fact: {
    'operations': [
      operationSchema,
    ],
  },
})

module.exports = mongoose.model('summary', summarySchema);

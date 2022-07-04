const mongoose = require('../_utils/db');

const operationSchema = new mongoose.Schema({
  title: String,
  brief: String,
  quantity: Number,
});

const summarySchema = new mongoose.Schema({
  date: {
    type: String,
    unique: true,
    required: true,
  },
  prod_line: {
    type: String,
    default: 1,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  plan:  {
    operation_list: [
      operationSchema,
    ],
  },
  fact: {
    operation_list: [
      operationSchema,
    ],
  },
})

module.exports = mongoose.model('summary', summarySchema);

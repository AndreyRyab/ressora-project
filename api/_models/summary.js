const mongoose = require('../_utils/db');

const operationSchema = new mongoose.Schema({
  title: String,
  brief: String,
  quantity: Number,
});

const dataInputSchema = new mongoose.Schema(
  {
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    operation_list: [
      operationSchema,
    ],
  },
  { timestamps: true },
);

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
  plan: dataInputSchema,
  fact: [
    dataInputSchema,
  ],
}, { timestamps: true });

module.exports = mongoose.model('summary', summarySchema);

const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  user_id: String,
  money: Number,
  month: Number,
  year: Number,
});

module.exports = mongoose.model('income', incomeSchema);
const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    money: Number,
    month: Number,
    year: Number,
    _user_id: String
});

module.exports = mongoose.model('income', incomeSchema);
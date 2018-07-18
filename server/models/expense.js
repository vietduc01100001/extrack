const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    name: String,
    cost: Number,
    date: Number,
    month: Number,
    year: Number,
    _user_id: String
});

exports.Food = mongoose.model('expenses.food', expenseSchema);
exports.House = mongoose.model('expenses.house', expenseSchema);
exports.Health = mongoose.model('expenses.health', expenseSchema);
exports.Transport = mongoose.model('expenses.transport', expenseSchema);
exports.Studying = mongoose.model('expenses.studying', expenseSchema);
exports.Entertainment = mongoose.model('expenses.entertainment', expenseSchema);
exports.Others = mongoose.model('expenses.others', expenseSchema);
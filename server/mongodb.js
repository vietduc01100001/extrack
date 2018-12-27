const mongoose = require('mongoose');

exports.init = () => {
  mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
};

exports.connection = mongoose.connection;

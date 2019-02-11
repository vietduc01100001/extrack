const mongoose = require('mongoose');

exports.init = () => {
  mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
};

exports.connection = mongoose.connection;

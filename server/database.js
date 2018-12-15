const mongoose = require('mongoose');

exports.init = function() {
    mongoose.connect(process.env.MONGODB_URL)
      .then(() => console.log('database connected'))
      .catch(err => console.log(err));
};

exports.connection = mongoose.connection;

const mongoose = require('mongoose');
require('dotenv').config();

exports.init = function() {
    mongoose.connect(process.env.MONGODB_URL);
    const conn = mongoose.connection;

    conn.on('connected', () => console.log('database connected'));

    conn.on('error', err => console.log(err));

    conn.on('disconnected', () => console.log('database disconnected'));

    process.on('SIGINT', () => {
        console.log('database disconnected due to application termination');
        conn.close(() => process.exit(0));
    });

};

exports.connection = mongoose.connection;
const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async() => {
    try {
        conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

module.exports = connectDb;
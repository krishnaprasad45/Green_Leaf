const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://admin:admin123@cluster0.ztohsqo.mongodb.net/greenleaf";

const connectDB = async () => {
    try {
        const con = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB connected: ${con.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;

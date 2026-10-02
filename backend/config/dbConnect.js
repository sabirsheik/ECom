const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

const dbConnect = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is required");
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database server connected");
        return mongoose.connection;
    } catch (error) {
        console.error("Database connection failed:", error.message);
        throw error;
    }
};
module.exports = dbConnect;
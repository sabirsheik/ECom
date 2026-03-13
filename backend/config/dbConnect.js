const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI).then(() => {
            console.log("Databsae Server Connected");
          })
          .catch((error) => {
            console.log("Database connection failed", error.message);
          });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
module.exports = dbConnect;
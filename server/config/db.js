const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const db = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB connection success, ${con.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection failure!");
  }
};

module.exports = db;

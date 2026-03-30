 const mongoose = require("mongoose");

 const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/Expense";

 const connectDB = async () => {
  try {
   await mongoose.connect(MONGO_URL);
  console.log("MongoDB connected successfully");
   } catch (error) {
    console.error("MongoDB connection failed:", error.message);
   process.exit(1); // Exit process with failure
   }
 };




// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     // 👉 YAHI LINE IMPORTANT HAI
//     const conn = await mongoose.connect(process.env.MONGO_URL);

//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(error.message);
//     process.exit(1);
//   }
// };

module.exports = connectDB;
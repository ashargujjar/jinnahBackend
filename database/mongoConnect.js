require("dotenv").config();
const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

async function startDb(cb) {
  await connectDB();
  if (mongoose.connection.readyState === 1) {
    cb();
  }
}

function getDb() {
  return mongoose.connection;
}

module.exports = { startDb, getDb };

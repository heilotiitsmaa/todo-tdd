const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(
      "mongodb://testuser:testpass@localhost:27017/todo-tdd?authSource=admin"
    );
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

module.exports = { connect };

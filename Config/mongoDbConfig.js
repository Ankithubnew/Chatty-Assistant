const mongoose = require("mongoose");
async function ConnectToDatabase() {
  try {
    await mongoose.connect(process.env.Mongo_Url);
    console.log("Database connected");
  } catch (error) {
    console.log("Database connection failed");
  }
}
module.exports = ConnectToDatabase;

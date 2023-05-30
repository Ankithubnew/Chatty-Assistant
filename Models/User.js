const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  credits: { type: Number, default: 5 },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  payload: {
    type: String,
  },
  promoapply: { type: Number, default: 0 },
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
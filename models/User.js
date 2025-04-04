const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  naverId: { type: String } // 소셜 로그인 시에만 사용
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
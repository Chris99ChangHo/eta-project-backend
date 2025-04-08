const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "이름은 필수입니다."],
    trim: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: [true, "이메일은 필수입니다."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "유효한 이메일 형식이 아닙니다."],
  },
  password: {
    type: String,
    required: function () {
      return this.provider === "local";
    },
    minlength: 6,
    select: false,
  },
  provider: {
    type: String,
    enum: ["local", "naver"],
    default: "local",
  },
  naverId: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user", // 일반 유저는 기본값이 user
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);

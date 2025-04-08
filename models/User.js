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
    select: false, // 기본 조회 시 비밀번호 제외
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);

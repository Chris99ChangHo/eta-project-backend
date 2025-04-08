const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["cover", "gangnam", "uijeongbu", "review"], // 카테고리 구분
    required: true,
  },
  type: {
    type: String,
    enum: ["photo", "text"], // 이미지 종류 (text는 수강후기)
    required: true,
  },
  filename: {
    type: String, // public/images/... 이후 경로
    required: true,
  },
});

module.exports = mongoose.model("Media", mediaSchema);

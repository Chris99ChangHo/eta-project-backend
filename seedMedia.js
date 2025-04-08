const mongoose = require("mongoose");
const Media = require("./models/Media");
require("dotenv").config();

const seedData = [
  // Cover 이미지
  { category: "cover", type: "photo", filename: "../client/public/images/cover/cover_1.png" },
  { category: "cover", type: "photo", filename: "../client/public/images/cover/cover_2.png" },
  { category: "cover", type: "photo", filename: "../client/public/images/cover/cover_3.png" },
  { category: "cover", type: "photo", filename: "../client/public/images/cover/cover_4.png" },

  // 강남 활동 사진
  { category: "gangnam", type: "photo", filename: "../client/public/images/review_photo/Gangnam/photo_1.jpg" }, 
  { category: "gangnam", type: "photo", filename: "../client/public/images/review_photo/Gangnam/photo_2.jpg" },

  // 의정부 활동 사진
  { category: "uijeongbu", type: "photo", filename: "../client/public/images/review_photo/Uijeongbu/photo_1.png" },
  { category: "uijeongbu", type: "photo", filename: "../client/public/images/review_photo/Uijeongbu/photo_2.png" },

  // 수강 후기 (text 이미지)
  { category: "review", type: "text", filename: "../client/public/images/review_text/text_1.png" },
  { category: "review", type: "text", filename: "../client/public/images/review_text/text_2.jpg" },
  { category: "review", type: "text", filename: "../client/public/images/review_text/text_3.jpg" },
  { category: "review", type: "text", filename: "../client/public/images/review_text/text_4.jpg" },
  { category: "review", type: "text", filename: "../client/public/images/review_text/text_5.jpg" },
  { category: "review", type: "text", filename: "../client/public/images/review_text/text_6.jpg" },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Media.deleteMany({});
  await Media.insertMany(seedData);
  console.log("📦 Media data inserted");
  mongoose.disconnect();
}

seed();

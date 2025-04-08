const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session"); // 세션 추가
const passport = require("./config/passport"); // Passport 설정 가져오기
const authRoutes = require("./routes/auth"); // 네이버 로그인 라우트 추가
const User = require("./models/User");  // User 모델 불러오기
const instagramRoutes = require('./routes/instagram'); // Instagram API 라우트 추가
const boardRoutes = require('./routes/board'); // 게시판 라우트 추가
const mediaRoutes = require("./routes/media"); // 미디어 라우트 추가

require("dotenv").config(); // .env 파일 불러오기

const app = express();

// ✅ 미들웨어 설정
app.use(cors());
app.use(express.json());

// ✅ 세션 설정 (Passport 사용하려면 필요함)
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// ✅ Passport 초기화 및 세션 사용
app.use(passport.initialize());
app.use(passport.session());

// ✅ MongoDB 연결
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ 미디어 라우트
app.use("/api/media", mediaRoutes); 

// static 폴더 경로 (이미지 사용 시 필요)
const path = require("path");
app.use("/images", express.static(path.join(__dirname, "../client/public/images")));

// ✅ 네이버 로그인 API 라우트 연결
app.use("/api/auth", authRoutes);

// ✅ 인스타그램 라우트
app.use("/api/instagram", instagramRoutes); 

// ✅ 게시판 라우트
app.use("/api/board", boardRoutes); 

// ✅ 서버 실행
const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

/*
// ✅ 리뷰 데이터 (임시 데이터)
const reviews = [
  { id: 1, text: "This class is amazing!" },
  { id: 2, text: "I learned so much from this class!" },
];

// ✅ GET: 수업 리뷰 가져오기
app.get("/api/reviews", (req, res) => {
  res.json(reviews);
});

// ✅ POST: 새로운 리뷰 추가
app.post("/api/reviews", (req, res) => {
  const newReview = { id: reviews.length + 1, text: req.body.text };
  reviews.push(newReview);
  res.json(newReview);
});
*/

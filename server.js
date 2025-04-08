const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("./config/passport");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config(); // .env 설정

// 모델 & 라우트 임포트
const User = require("./models/User");
const authRoutes = require("./routes/auth");
const instagramRoutes = require("./routes/instagram");
const boardRoutes = require("./routes/board");
const mediaRoutes = require("./routes/media");
const userRoutes = require("./routes/user"); // ✅ /api/me 라우트

const app = express();

// ✅ 미들웨어
app.use(cors());
app.use(express.json());

// ✅ 세션 + 패스포트
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
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

// ✅ 정적 파일 경로 (이미지 등)
app.use("/images", express.static(path.join(__dirname, "../client/public/images")));

// ✅ 라우트 연결
app.use("/api/auth", authRoutes);         // 네이버 로그인
app.use("/api/instagram", instagramRoutes); // 인스타그램
app.use("/api/board", boardRoutes);         // 게시판 (✅ /api/board/...)
app.use("/api/media", mediaRoutes);         // 이미지 업로드 등
app.use("/api", userRoutes);                // ✅ /api/me 등 유저 정보 조회

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

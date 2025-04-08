const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const passport = require("passport");
const authenticateToken = require("../middleware/authenticateToken");

// ✅ 회원가입 API
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "이미 가입된 이메일입니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      provider: "local",
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "회원가입 성공",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("회원가입 오류:", error);
    res.status(500).json({ message: "서버 오류. 다시 시도해주세요." });
  }
});

// ✅ 로그인 API
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, provider: "local" });
    if (!user) {
      return res.status(400).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "로그인 성공",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("로그인 오류:", error);
    res.status(500).json({ message: "서버 오류. 다시 시도해주세요." });
  }
});

// ✅ 네이버 로그인 시작
router.get("/naver", passport.authenticate("naver"));

// ✅ 네이버 로그인 콜백
router.get(
  "/naver/callback",
  passport.authenticate("naver", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // 프론트엔드 리다이렉트
    res.redirect(`http://localhost:3000/naver-success?token=${token}`);
  }
);

// ✅ 로그인 후 유저 정보 불러오기 API (프론트에서 /me 요청용)
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "사용자 정보를 찾을 수 없습니다." });

    res.json({ user });
  } catch (error) {
    console.error("유저 정보 조회 실패:", error);
    res.status(500).json({ message: "서버 오류. 다시 시도해주세요." });
  }
});

module.exports = router;

/* 
// Kakao 로그인
router.get("/kakao", passport.authenticate("kakao"));
router.get("/kakao/callback",passport.authenticate("kakao", { failureRedirect: "/" }),
  (req, res) => res.redirect("/dashboard")
);
*/

/* 
// Google 로그인
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => res.redirect("/dashboard")
);*/

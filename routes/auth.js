const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const passport = require("passport");

// 회원가입 API
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 이미 존재하는 이메일인지 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "이미 가입된 이메일입니다." });
    }

    // 비밀번호 해시 처리
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새 사용자 생성
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // 토큰 생성
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


// 로그인 API
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

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

// Naver 로그인
router.get("/naver", passport.authenticate("naver"));
router.get("/naver/callback", passport.authenticate("naver", { failureRedirect: "/" }),
  (req, res) => res.redirect("/dashboard")
);

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

module.exports = router;
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// ✅ 로그인한 유저 정보 가져오기 (토큰 필요)
router.get("/me", authMiddleware, (req, res) => {
  res.json(req.user); // req.user는 authMiddleware에서 설정됨
});

module.exports = router;

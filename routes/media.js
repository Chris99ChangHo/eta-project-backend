const express = require("express");
const router = express.Router();
const Media = require("../models/Media");

// 📌 미디어 목록 조회 (모든 카테고리)
router.get("/", async (req, res) => {
    try {
      const media = await Media.find();
      res.json(media);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  module.exports = router;

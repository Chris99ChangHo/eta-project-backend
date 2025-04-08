const express = require("express");
const router = express.Router();
const Board = require("../models/Board");
const authMiddleware = require("../middleware/authMiddleware");

// 📌 게시글 목록 조회 (검색 포함, 공지 상단 고정)
router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";
    const regex = new RegExp(search, "i");

    const posts = await Board.find({
      $or: [{ title: regex }, { content: regex }],
    })
      .populate("author", "name") // 사용자 이름만 표시
      .sort({ isNotice: -1, createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("게시글 조회 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 📌 단일 게시글 조회 + 조회수 증가
router.get("/:id", async (req, res) => {
  try {
    const post = await Board.findById(req.params.id).populate("author", "name");

    if (!post) {
      return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
    }

    post.views++;
    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

// 📌 게시글 작성 (로그인 필요)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, isNotice } = req.body;

    const post = new Board({
      title,
      content,
      author: req.user.id,
      isNotice: isNotice || false,
    });

    await post.save();

    res.status(201).json(post);
  } catch (err) {
    console.error("글 작성 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 📌 게시글 수정 (작성자 본인만)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Board.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "게시글이 존재하지 않습니다." });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "수정 권한이 없습니다." });
    }

    const { title, content } = req.body;
    post.title = title;
    post.content = content;
    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

// 📌 게시글 삭제 (작성자 본인만)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Board.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "게시글이 존재하지 않습니다." });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "삭제 권한이 없습니다." });
    }

    await post.deleteOne();
    res.json({ message: "게시글이 삭제되었습니다." });
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;

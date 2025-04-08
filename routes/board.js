const express = require("express");
const router = express.Router();
const Board = require("../models/Board");
const authMiddleware = require("../middleware/authMiddleware");

// 📌 게시글 목록 조회 (검색 + 카테고리 + 공지 상단 고정)
router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";
    const category = req.query.category || null;
    const regex = new RegExp(search, "i");

    const query = {
      $or: [{ title: regex }, { content: regex }],
    };

    if (category) {
      query.category = category;
    }

    const posts = await Board.find(query)
      .populate("author", "name")
      .sort({ isNotice: -1, createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("게시글 조회 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 📌 게시글 상세 조회 + 조회수 증가
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
    console.error("게시글 상세 조회 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 📌 게시글 작성
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, isNotice, category } = req.body;

    // 일반 사용자가 공지사항으로 작성하려는 경우 차단
    if (isNotice && req.user.role !== "admin") {
      return res.status(403).json({ message: "공지사항 작성은 관리자만 가능합니다." });
    }

    const post = new Board({
      title,
      content,
      category: category || "general",
      author: req.user._id,
      isNotice: !!isNotice, // boolean 처리
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error("글 작성 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 📌 게시글 수정
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Board.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "게시글이 존재하지 않습니다." });

    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "수정 권한이 없습니다." });
    }

    const { title, content, category, isNotice } = req.body;

    post.title = title;
    post.content = content;
    post.category = category;

    // 🔐 관리자만 공지 설정 가능
    if (req.user.role === "admin") {
      post.isNotice = isNotice;
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "서버 에러" });
  }
});

// 📌 게시글 삭제
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Board.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "게시글이 존재하지 않습니다." });

    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "삭제 권한이 없습니다." });
    }

    await post.deleteOne();
    res.json({ message: "게시글이 삭제되었습니다." });
  } catch (err) {
    console.error("게시글 삭제 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;

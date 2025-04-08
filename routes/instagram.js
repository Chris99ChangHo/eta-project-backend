const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

const INSTAGRAM_URL = "https://graph.instagram.com/me/media";
// const FIELDS = "id,caption,media_url,permalink,media_type,thumbnail_url,timestamp";
const FIELDS = "id,caption,media_type,media_url,permalink,timestamp,thumbnail_url,like_count,comments_count,username";
const token = process.env.INSTAGRAM_ACCESS_TOKEN;

/// 📸 인스타그램 API를 통해 강사 소개 피드를 가져오는 API
const TARGET_LINKS = [
  "https://www.instagram.com/p/DBaiZnryt6m/",
  "https://www.instagram.com/p/DBajJTVSEDo/",
];

const normalize = (url) => url.replace(/\/+$/, "");

async function fetchInstructorPostsByLink() {
  const normalizedTargets = TARGET_LINKS.map(normalize);
  let results = [];
  let url = `${INSTAGRAM_URL}?fields=${FIELDS}&access_token=${token}`;
  while (url) {
    try {
      const response = await axios.get(url);
      const posts = response.data.data;
      const matching = posts.filter((post) =>
        normalizedTargets.includes(normalize(post.permalink))
      );

      results = [...results, ...matching];

      if (results.length >= normalizedTargets.length) break;

      url = response.data.paging?.next || null;
    } catch (err) {
        console.error("❌ Instagram API Error:", err.response?.data || err.message);
      break;
    }
  }

  return results;
}

// ✅ instructors용 API
router.get("/media/instructors", async (req, res) => {
  try {
    const posts = await fetchInstructorPostsByLink();
    res.json({ posts });
  } catch (error) {
    console.error("Failed to fetch instructors:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch instructor posts." });
  }
});

// ✅ 전체 피드용 API
router.get("/media", async (req, res) => {
  let results = [];
  let url = `${INSTAGRAM_URL}?fields=${FIELDS}&access_token=${token}`;
  try {
    while (url) {
      const response = await axios.get(url);
      results = [...results, ...response.data.data];
      url = response.data.paging?.next || null;
    }

    res.json({ data: results });
  } catch (error) {
    console.error("❌ Instagram 전체 피드 로딩 실패:", error.response?.data || error.message);
    res.status(500).json({ error: "전체 피드를 불러오는 데 실패했습니다." });
  }
});

module.exports = router;

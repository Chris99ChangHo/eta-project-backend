const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 수업 리뷰 데이터
const reviews = [
    { id: 1, text: 'This class is amazing!' },
    { id: 2, text: 'I learned so much from this class!' },
];

// GET: 수업 리뷰 가져오기
app.get('/api/reviews', (req, res) => {
    res.json(reviews);
});

// POST: 새로운 리뷰 추가
app.post('/api/reviews', (req, res) => {
    const newReview = { id: reviews.length + 1, text: req.body.text };
    reviews.push(newReview);
    res.json(newReview);
});

// 서버 실행
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

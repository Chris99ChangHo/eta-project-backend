const express = require('express');
const cors = require('cors');
const app = express();

// JSON 데이터를 처리하기 위한 미들웨어
app.use(express.json());
app.use(cors()); // CORS 문제 해결

// GET 요청 처리
app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from Node.js!' });
});

// POST 요청 처리
app.post('/api/message', (req, res) => {
    const { message } = req.body; // 클라이언트에서 보낸 메시지
    console.log('Received message:', message);
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }
    res.json({ status: 'Message received', receivedMessage: message });
});

// 서버 실행
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

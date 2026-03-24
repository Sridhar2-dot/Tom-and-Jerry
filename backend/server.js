const express = require('express');
const cors = require('cors');
const path = require('path');

const questionsRouter = require('./routes/questions');
const executeRouter = require('./routes/execute');
const scoresRouter = require('./routes/scores');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/questions', questionsRouter);
app.use('/api/execute', executeRouter);
app.use('/api/scores', scoresRouter);
app.use('/api/leaderboard', scoresRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Code Runner backend is running!' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Code Runner Backend running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Questions: http://localhost:${PORT}/api/questions?difficulty=easy\n`);
});

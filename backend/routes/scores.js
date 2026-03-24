const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const scoresPath = path.join(__dirname, '../data/scores.json');

function readScores() {
  try {
    if (!fs.existsSync(scoresPath)) {
      fs.writeFileSync(scoresPath, '[]', 'utf8');
    }
    return JSON.parse(fs.readFileSync(scoresPath, 'utf8'));
  } catch {
    return [];
  }
}

function writeScores(scores) {
  fs.writeFileSync(scoresPath, JSON.stringify(scores, null, 2), 'utf8');
}

// POST /api/scores - save a score
router.post('/', (req, res) => {
  const { name, score, distance, difficulty } = req.body;
  if (!name || score === undefined) {
    return res.status(400).json({ error: 'Missing name or score' });
  }
  const scores = readScores();
  const entry = {
    id: Date.now(),
    name: String(name).slice(0, 20),
    score: Number(score),
    distance: Number(distance) || 0,
    difficulty: difficulty || 'easy',
    date: new Date().toISOString()
  };
  scores.push(entry);
  writeScores(scores);
  res.json({ success: true, entry });
});

// GET /api/leaderboard - top 10
router.get('/leaderboard', (req, res) => {
  const scores = readScores();
  const top10 = scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  res.json(top10);
});

// GET /api/scores - alias
router.get('/', (req, res) => {
  const scores = readScores();
  const top10 = scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  res.json(top10);
});

module.exports = router;

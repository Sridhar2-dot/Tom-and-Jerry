const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const questionsPath = path.join(__dirname, '../data/questions.json');

router.get('/', (req, res) => {
  try {
    const { difficulty } = req.query;
    const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
    
    let filtered = questions;
    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty.toLowerCase())) {
      filtered = questions.filter(q => q.difficulty === difficulty.toLowerCase());
    }
    
    if (filtered.length === 0) {
      return res.status(404).json({ error: 'No questions found for that difficulty' });
    }
    
    // Return a random question
    const randomQuestion = filtered[Math.floor(Math.random() * filtered.length)];
    res.json(randomQuestion);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load questions', details: err.message });
  }
});

router.get('/all', (req, res) => {
  try {
    const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load questions' });
  }
});

module.exports = router;

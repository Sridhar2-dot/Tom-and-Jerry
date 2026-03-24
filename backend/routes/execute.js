const express = require('express');
const router = express.Router();
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const questionsPath = path.join(__dirname, '../data/questions.json');

router.post('/', (req, res) => {
  const { code, questionId } = req.body;

  if (!code || !questionId) {
    return res.status(400).json({ error: 'Missing code or questionId' });
  }

  // Sanitize: block dangerous imports
  const forbidden = ['import os', 'import sys', 'import subprocess', '__import__', 'open(', 'exec(', 'eval(', 'import socket', 'import shutil'];
  for (const keyword of forbidden) {
    if (code.toLowerCase().includes(keyword.toLowerCase())) {
      return res.json({
        passed: false,
        output: '',
        error: `Forbidden keyword detected: "${keyword}". Keep code clean!`
      });
    }
  }

  let questions;
  try {
    questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
  } catch (e) {
    return res.status(500).json({ error: 'Could not load questions' });
  }

  const question = questions.find(q => q.id === questionId);
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  const testCases = question.testCases;
  const results = [];
  let allPassed = true;

  for (const testCase of testCases) {
    // Build code with input injection if needed
    let fullCode = code;
    if (testCase.input !== null && testCase.input !== undefined && testCase.input !== '') {
      // Inject input as a variable if needed
      fullCode = `_input = ${JSON.stringify(String(testCase.input))}\nimport builtins\n_input_lines = _input.split('\\n')\n_input_index = 0\ndef _fake_input(prompt=''):\n    global _input_index\n    val = _input_lines[_input_index] if _input_index < len(_input_lines) else ''\n    _input_index += 1\n    return val\nbuiltins.input = _fake_input\n${code}`;
    }

    const result = spawnSync('python', ['-c', fullCode], {
      timeout: 5000,
      encoding: 'utf8',
      maxBuffer: 1024 * 1024
    });

    const stdout = (result.stdout || '').trim();
    const stderr = (result.stderr || '').trim();
    const expected = String(testCase.expectedOutput).trim();

    const passed = stdout === expected && !result.error;

    results.push({
      input: testCase.input,
      expected,
      got: stdout,
      error: stderr,
      passed
    });

    if (!passed) allPassed = false;
  }

  const firstResult = results[0];
  res.json({
    passed: allPassed,
    output: firstResult?.got || '',
    error: firstResult?.error || (results.find(r => !r.passed)?.error) || '',
    results
  });
});

module.exports = router;

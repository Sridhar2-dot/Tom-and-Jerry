import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 10000,
});

export const fetchQuestion = (difficulty = 'easy') =>
  API.get(`/api/questions?difficulty=${difficulty}`).then(r => r.data);

export const executeCode = (code, questionId) =>
  API.post('/api/execute', { code, questionId }).then(r => r.data);

export const submitScore = (name, score, distance, difficulty) =>
  API.post('/api/scores', { name, score, distance, difficulty }).then(r => r.data);

export const fetchLeaderboard = () =>
  API.get('/api/leaderboard').then(r => r.data);

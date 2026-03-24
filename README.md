# 🏃 Code Runner — Gamified Coding Endless Runner

> **Write code to survive.** A thief runs endlessly through a neon city. A police officer chases behind. Your coding skills determine who wins.

---

## 🎮 Gameplay

| Event | Effect |
|---|---|
| ✅ Correct answer | Speed boost + Police retreats |
| ❌ Wrong answer | Police closes in |
| ❌❌ Two wrongs / Timeout | **CAUGHT — Game Over** |

Questions appear every ~9 seconds. You have 15–25 seconds to write and submit Python code.

---

## 📁 Project Structure

```
Game/
├── backend/
│   ├── server.js            # Express entry point (port 3001)
│   ├── routes/
│   │   ├── questions.js     # GET /api/questions?difficulty=easy|medium|hard
│   │   ├── execute.js       # POST /api/execute  (runs Python safely)
│   │   └── scores.js        # POST /api/scores  GET /api/leaderboard
│   └── data/
│       ├── questions.json   # 30 questions (Easy/Medium/Hard)
│       └── scores.json      # Leaderboard persistence
│
└── frontend/
    └── src/
        ├── App.jsx
        ├── api/index.js
        ├── hooks/
        │   ├── useGameLoop.js
        │   └── useSound.js
        └── components/
            ├── GameCanvas.jsx     # HTML5 Canvas animation
            ├── GameScreen.jsx     # Game orchestrator + loop
            ├── HUD.jsx            # Score/distance/police bar
            ├── QuestionPanel.jsx  # Monaco editor + timer
            ├── MenuScreen.jsx     # Difficulty selector
            ├── GameOverScreen.jsx # Caught screen
            └── Leaderboard.jsx    # Top 10 scores
```

---

## 🚀 Running Locally

### Requirements
- [Node.js](https://nodejs.org/) v18+
- [Python](https://python.org/) 3.x (must be on PATH)

### Terminal 1 — Backend
```bash
cd Game/backend
npm install
node server.js
# → http://localhost:3001
```

### Terminal 2 — Frontend
```bash
cd Game/frontend
npm install
npm run dev
# → http://localhost:5173
```

### Test the backend
```bash
# Get a random easy question
curl http://localhost:3001/api/questions?difficulty=easy

# Run Python code
curl -X POST http://localhost:3001/api/execute \
  -H "Content-Type: application/json" \
  -d "{\"code\":\"print(2+2)\",\"questionId\":\"easy_2\"}"
```

---

## 🔒 Security Notes

Code execution uses `child_process.spawnSync` with:
- **5-second timeout** (protects against infinite loops)
- **Forbidden keyword blocklist** (no `os`, `sys`, `subprocess`, `open`, `eval`, etc.)

> For production, replace with [Judge0](https://judge0.com/) or Docker isolation.

---

## ☁️ Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Deploy dist/ to Vercel
```

### Backend → Render / Railway
- Point to `backend/` directory
- Start command: `node server.js`
- Add env var: `PORT=3001`

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Monaco Editor |
| Styling | Vanilla CSS (dark theme, animations) |
| Backend | Node.js, Express |
| Code exec | Python via child_process |
| Persistence | scores.json (flat file) |
| Sound | Web Audio API |
| Animation | HTML5 Canvas (rAF loop) |

import React, { useState, useEffect, useRef, useCallback } from 'react';
import GameCanvas from './GameCanvas';
import HUD from './HUD';
import QuestionPanel from './QuestionPanel';
import { fetchQuestion } from '../api';
import { useSound } from '../hooks/useSound';
import sadJerryImg from './cute-jerry-dp-picture-removebg-preview.png';

const QUESTION_INTERVAL = 500;
const POLICE_CLOSE_WRONG = 0.18;
const POLICE_RETREAT = 0.14;
const SPEED_BOOST = 0.12;
const SPEED_DECAY = 0.003;
const POLICE_CREEP = 0.004;
const BASE_SPEED = 1.0;
const BASE_POLICE = 0.15;

export default function GameScreen({ difficulty, onGameOver }) {
  const [phase, setPhase] = useState('RUNNING'); // RUNNING | QUESTION | RESULT
  const [question, setQuestion] = useState(null);
  const [resultFlash, setResultFlash] = useState(null);
  const [shake, setShake] = useState(false);

  const gameStateRef = useRef({
    score: 0,
    distance: 0,
    playerSpeed: BASE_SPEED,
    policeProximity: BASE_POLICE,
    wrongCount: 0,
    questionTimer: 0, // Start first question immediately
    running: true,
    lastTime: null,
  });

  const [uiState, setUiState] = useState({
    score: 0,
    distance: 0,
    playerSpeed: BASE_SPEED,
    policeProximity: BASE_POLICE,
    wrongCount: 0,
  });

  const { playCorrect, playWrong, playGameOver, playTick } = useSound();
  const rafRef = useRef(null);
  const questionFetchedRef = useRef(false);
  const phaseRef = useRef('RUNNING');

  useEffect(() => { phaseRef.current = phase; }, [phase]);

  const tick = useCallback((timestamp) => {
    const s = gameStateRef.current;
    if (!s.running) return;

    if (s.lastTime === null) s.lastTime = timestamp;
    const dt = Math.min((timestamp - s.lastTime) / 1000, 0.1);
    s.lastTime = timestamp;

    // Keep characters running and distance increasing during all phases
    s.distance += s.playerSpeed * 70 * dt;
    s.score = Math.floor(s.distance * 1.5 + (s.playerSpeed - 1) * 200);
    s.playerSpeed = Math.max(BASE_SPEED, s.playerSpeed - SPEED_DECAY * dt);
    s.policeProximity = Math.min(0.99, s.policeProximity + POLICE_CREEP * dt);

    // Only update the question timer and fetch new questions in RUNNING phase
    if (phaseRef.current === 'RUNNING') {
      s.questionTimer -= dt * 1000;
      if (s.questionTimer <= 0 && !questionFetchedRef.current) {
        questionFetchedRef.current = true;
        s.questionTimer = QUESTION_INTERVAL;
      }
    }

    if (Math.round(timestamp / 100) % 2 === 0) {
      setUiState({
        score: s.score,
        distance: s.distance,
        playerSpeed: s.playerSpeed,
        policeProximity: s.policeProximity,
        wrongCount: s.wrongCount,
      });
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (!questionFetchedRef.current) return;
    questionFetchedRef.current = false;
    loadQuestion();
  });

  const loadQuestion = useCallback(async () => {
    try {
      const q = await fetchQuestion(difficulty);
      setQuestion(q);
      setPhase('QUESTION');
    } catch (e) {
      questionFetchedRef.current = false;
    }
  }, [difficulty]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  const handleResult = useCallback((passed, isTimeout = false) => {
    const s = gameStateRef.current;
    if (passed) {
      s.playerSpeed = Math.min(3.5, s.playerSpeed + SPEED_BOOST);
      s.policeProximity = Math.max(0.05, s.policeProximity - POLICE_RETREAT);
      s.score += 500;
      playCorrect();
      setResultFlash({ type: 'correct', msg: '⚡ CODE CORRECT! +500 pts' });
    } else {
      s.wrongCount += 1;
      s.policeProximity = Math.min(0.99, s.policeProximity + POLICE_CLOSE_WRONG);
      playWrong();
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setResultFlash({
        type: 'wrong',
        msg: s.wrongCount >= 3 ? '❌ CAUGHT!' : (isTimeout === true ? '⏰ TIME OUT! Tom is closing in...' : '❌ WRONG CODE! Tom is closing in...'),
      });

      if (s.wrongCount >= 3) {
        s.running = false;
        s.policeProximity = 1.0;
        setUiState(prev => ({ ...prev, policeProximity: 1.0, wrongCount: s.wrongCount }));
        playGameOver();
        setTimeout(() => onGameOver({ score: s.score, distance: s.distance }), 3000); // 3 seconds delay
      }
    }

    setTimeout(() => setResultFlash(null), 2500);
    setPhase('RUNNING');
    setQuestion(null);
  }, [playCorrect, playWrong, playGameOver, onGameOver]);

  const handleTimeout = useCallback(() => {
    playTick();
    handleResult(false, true);
  }, [handleResult, playTick]);

  return (
    <div className="game-wrapper">
      
      {/* ── Left Termial (Fixed width code panel) ── */}
      <div className="game-left-panel">
        {question ? (
          <QuestionPanel
            question={question}
            onResult={handleResult}
            onTimeout={handleTimeout}
          />
        ) : (
          <div className="question-side-panel shadow-inner" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <img src={uiState.wrongCount >= 3 ? sadJerryImg : "/runner.gif"} alt="runner" className={uiState.wrongCount >= 3 ? "" : "anim-float"} style={{ width: uiState.wrongCount >= 3 ? 100 : 60, height: uiState.wrongCount >= 3 ? 100 : 60, marginBottom: 12 }} />
            <h2 className="font-game" style={{ fontSize: 18, color: uiState.wrongCount >= 3 ? '#ef4444' : '#00d4ff', marginBottom: 8 }}>
              {uiState.wrongCount >= 3 ? 'I trusted you 🐭💔' : 'CHASE IN PROGRESS'}
            </h2>
            <p style={{ fontSize: 13, color: '#475569', maxWidth: 240, letterSpacing: 1 }}>
              {uiState.wrongCount >= 3 ? '' : <>Searching for next challenge...<br/>Stay focussed Jerry!</>}
            </p>
            <div style={{ marginTop: 24, padding: '4px 12px', border: '1px solid #1e293b', borderRadius: 20, fontSize: 10, textTransform: 'uppercase', color: '#94a3b8' }}>
               {uiState.wrongCount >= 3 ? 'System Offline' : 'Terminal Standby'}
            </div>
          </div>
        )}
      </div>

      {/* ── Right Canvas ── */}
      <div className="game-right-panel" style={{ flex: 1, position: 'relative' }}>
        <GameCanvas
          running={true}
          playerSpeed={uiState.playerSpeed}
          policeProximity={uiState.policeProximity}
          shake={shake}
        />

        <HUD
          score={uiState.score}
          distance={uiState.distance}
          policeProximity={uiState.policeProximity}
          wrongCount={uiState.wrongCount}
          speed={uiState.playerSpeed}
        />

        {resultFlash && (
          <div className={`result-flash ${resultFlash.type}`}>
            {resultFlash.msg}
          </div>
        )}
      </div>
    </div>
  );
}

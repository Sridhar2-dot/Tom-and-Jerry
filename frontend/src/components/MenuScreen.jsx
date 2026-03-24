import React, { useState } from 'react';
import Leaderboard from './Leaderboard';

const DIFFICULTIES = [
  { key: 'easy',   label: 'Easy',   icon: '🟢', desc: 'Variables, Types, Operators, Input, Conditions, Loops', color: '#22c55e' },
  { key: 'medium', label: 'Medium', icon: '🟡', desc: 'Arrays, Functions, Recursion, Lambda, Map/Filter, Decorators', color: '#eab308' },
  { key: 'hard',   label: 'Hard',   icon: '🔴', desc: 'OOP, Polymorphism, Inheritance, Exceptions, File Handling', color: '#ef4444' },
];

// Decorative star field
function Stars() {
  const stars = React.useMemo(() => Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2.5 + 0.5,
    delay: `${Math.random() * 3}s`,
    dur: `${1.5 + Math.random() * 2}s`,
  })), []);
  return (
    <div className="stars">
      {stars.map(s => (
        <div key={s.id} className="star" style={{
          left: s.left, top: s.top,
          width: s.size, height: s.size,
          animationDelay: s.delay,
          animationDuration: s.dur,
        }} />
      ))}
    </div>
  );
}

export default function MenuScreen({ onPlay }) {
  const [difficulty, setDifficulty] = useState('easy');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <div className="screen-overlay" style={{ position: 'relative', overflow: 'hidden' }}>
      <Stars />

      {/* Glow orbs */}
      <div style={{
        position: 'absolute', width: 600, height: 600,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
        top: '-200px', left: '-200px', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 500, height: 500,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)',
        bottom: '-150px', right: '-100px', pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div className="anim-fadeIn" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <img src="/200.gif" alt="runner" style={{ width: 'clamp(50px, 12vh, 90px)', height: 'clamp(50px, 12vh, 90px)', marginBottom: 4 }} />
        <h1 className="font-game glow-cyan main-logo" style={{
          fontSize: 'clamp(28px, 5vw, 64px)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 4,
          letterSpacing: 4,
        }}>CODE RUNNER</h1>
        <p style={{ color: '#94a3b8', fontSize: 16, letterSpacing: 2, textTransform: 'uppercase' }}>
          Code to Survive · Slow Tom Down
        </p>
      </div>

      {/* How to play */}
      <div className="glass-card anim-fadeIn" style={{
        padding: '20px 28px', maxWidth: 480, width: '90%', position: 'relative', zIndex: 1,
        animationDelay: '0.1s',
      }}>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { icon: '⌚', text: 'Answer within time limit' },
            { icon: '✅', text: 'Correct → Tom slows down' },
            { icon: '❌', text: '3 wrong = Game Over' },
          ].map((tip, i) => (
            <div key={i} style={{ textAlign: 'center', flex: '1 1 120px', minWidth: 100 }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{tip.icon}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{tip.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Difficulty selector */}
      <div className="anim-fadeIn" style={{
        width: '90%', maxWidth: 480, position: 'relative', zIndex: 1,
        animationDelay: '0.2s',
      }}>
        <p style={{ textAlign: 'center', fontSize: 12, color: '#475569', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
          Select Difficulty
        </p>
        <div className="diff-container">
          {DIFFICULTIES.map(d => (
            <button
              key={d.key}
              className="diff-btn"
              onClick={() => setDifficulty(d.key)}
              style={{
                flex: "1", padding: '14px 8px', borderRadius: 12, cursor: 'pointer',
                border: difficulty === d.key ? `2px solid ${d.color}` : '2px solid rgba(255,255,255,0.06)',
                background: difficulty === d.key ? `${d.color}1a` : 'rgba(22,22,31,0.8)',
                color: difficulty === d.key ? d.color : '#94a3b8',
                fontWeight: 700, fontSize: 13, transition: 'all 0.2s',
                boxShadow: difficulty === d.key ? `0 0 20px ${d.color}33` : 'none',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 4 }}>{d.icon}</div>
              <div>{d.label}</div>
              <div style={{ fontSize: 10, fontWeight: 400, marginTop: 4, opacity: 0.7 }}>{d.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="anim-fadeIn" style={{ display: 'flex', gap: 12, position: 'relative', zIndex: 1, animationDelay: '0.3s' }}>
        <button className="btn btn-primary btn-lg" onClick={() => onPlay(difficulty)}>
          🚀 Start Running
        </button>
        <button className="btn btn-ghost" onClick={() => setShowLeaderboard(true)}>
          🏆 Leaderboard
        </button>
      </div>

      {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
    </div>
  );
}

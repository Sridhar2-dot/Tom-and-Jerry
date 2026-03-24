import React, { useState } from 'react';
import { submitScore } from '../api';
import Leaderboard from './Leaderboard';

export default function GameOverScreen({ score, distance, difficulty, onRestart }) {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await submitScore(name.trim(), score, distance, difficulty);
      setSubmitted(true);
    } catch (e) {
      setSubmitted(true); // still show leaderboard even if save fails
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="screen-overlay" style={{ background: 'radial-gradient(ellipse at center, #1a0a0a 0%, #050508 100%)' }}>
      {/* Decorative glow */}
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(239,68,68,0.2) 0%, transparent 70%)',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      {/* Caught animation */}
      <div className="anim-bounceIn" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <img src="/siren.png" alt="jerry" style={{ width: 120, height: 120, marginBottom: 8, objectFit: 'contain' }} />
        <h1 className="font-game" style={{
          fontSize: 'clamp(50px, 10vw, 80px)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #ef4444, #f97316)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: 6,
          textTransform: 'uppercase',
          marginBottom: 8,
        }}>CAUGHT!</h1>
        <p style={{ color: '#94a3b8', fontSize: 'clamp(14px, 3vw, 16px)', letterSpacing: 2 }}>Tom Caught Jerry!</p>
      </div>

      {/* Stats */}
      <div className="glass-card anim-fadeIn" style={{
        width: 'clamp(280px, 90%, 480px)',
        padding: '20px', display: 'flex', gap: '16px',
        position: 'relative', zIndex: 1, flexWrap: 'nowrap', justifyContent: 'space-around'
      }}>
        {[
          { label: 'Score', value: score.toLocaleString(), icon: '⭐', color: '#00d4ff' },
          { label: 'Distance', value: `${Math.round(distance)}m`, icon: <img src="/runner.gif" style={{width: 24, height: 24}} alt="runner"/>, color: '#22c55e' },
          { label: 'Mode', value: difficulty.toUpperCase(), icon: '🎯', color: '#7c3aed' },
        ].map((stat, i) => (
          <div key={i} style={{ flex: '1 1 0', textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(24px, 6vw, 32px)', marginBottom: 4 }}>{stat.icon}</div>
            <div className="font-game" style={{ fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: 900, color: stat.color }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 'clamp(11px, 3vw, 13px)', color: '#475569', textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Score submission */}
      {!submitted ? (
        <div className="glass-card anim-fadeIn" style={{
          padding: 'clamp(12px, 4vw, 24px)', width: 'clamp(260px, 80%, 380px)',
          position: 'relative', zIndex: 1, animationDelay: '0.3s',
        }}>
          <p style={{ color: '#94a3b8', marginBottom: 12, fontSize: 'clamp(12px, 3vw, 14px)', textAlign: 'center' }}>
            Save your score to the leaderboard!
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              className="game-input"
              maxLength={20}
              placeholder="Enter your name..."
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              autoFocus
            />
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting || !name.trim()}
              style={{ whiteSpace: 'nowrap' }}
            >
              {submitting ? '...' : '💾 Save'}
            </button>
          </div>
        </div>
      ) : (
        <div className="anim-bounceIn" style={{ textAlign: 'center', color: '#22c55e', fontSize: 16, position: 'relative', zIndex: 1 }}>
          ✅ Score saved! You're on the board!
        </div>
      )}

      {/* Action buttons */}
      <div className="anim-fadeIn" style={{ display: 'flex', gap: 12, position: 'relative', zIndex: 1, animationDelay: '0.4s' }}>
        <button className="btn btn-primary btn-lg" onClick={onRestart}>
          🔄 Try Again
        </button>
        <button className="btn btn-ghost" onClick={() => setShowLeaderboard(true)}>
          🏆 Leaderboard
        </button>
      </div>

      {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
    </div>
  );
}

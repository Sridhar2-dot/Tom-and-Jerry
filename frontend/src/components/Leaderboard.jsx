import React, { useState, useEffect } from 'react';
import { fetchLeaderboard } from '../api';

const RANK_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];
const RANK_EMOJIS = ['🥇', '🥈', '🥉'];

export default function Leaderboard({ onClose }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard()
      .then(setScores)
      .catch(() => setScores([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="leaderboard-modal" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="leaderboard-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 className="font-game" style={{ fontSize: 24, color: '#8B0000' }}>
            🏆 Leaderboard
          </h2>
          <button className="btn btn-ghost btn-sm" style={{borderColor: '#8B0000', color: '#8B0000'}} onClick={onClose}>✕ Close</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#8B0000' }}>
            <div style={{ fontSize: 32, marginBottom: 8, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙️</div>
            <div>Loading scores...</div>
          </div>
        ) : scores.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#8B0000' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎮</div>
            <div>No scores yet. Be the first!</div>
          </div>
        ) : (
          <div>
            {scores.map((entry, i) => (
              <div key={entry.id} className="lb-row" style={{
                border: i < 3 ? `3px solid ${RANK_COLORS[i]}` : undefined,
                background: i < 3 ? '#FFFACD' : undefined,
              }}>
                <div className="lb-rank" style={{ color: i < 3 ? RANK_COLORS[i] : '#333' }}>
                  {i < 3 ? RANK_EMOJIS[i] : `#${i + 1}`}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, color: '#333', fontSize: 16 }}>{entry.name}</div>
                  <div style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {entry.difficulty} • {Math.round(entry.distance)}m
                  </div>
                </div>
                <div>
                  <div className="font-game" style={{ fontSize: 18, fontWeight: 900, color: '#00d4ff' }}>
                    {entry.score.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 10, color: '#475569', textAlign: 'right' }}>pts</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';

export default function HUD({ score, distance, policeProximity, wrongCount, speed }) {
  // policeProximity: 0 (far) to 1 (caught)
  const pct = Math.min(100, Math.round(policeProximity * 100));
  const barColor = pct < 40 ? '#22c55e' : pct < 70 ? '#eab308' : '#ef4444';

  return (
    <div className="hud">
      {/* Score */}
      <div className="hud-stat">
        <span style={{ fontSize: 18 }}>⭐</span>
        <div>
          <div className="hud-label">Score</div>
          <div className="hud-value">{score.toLocaleString()}</div>
        </div>
      </div>

      {/* Distance */}
      <div className="hud-stat">
        <img src="/runner.gif" alt="runner" style={{ width: 24, height: 24, objectFit: 'contain' }} />
        <div>
          <div className="hud-label">Distance</div>
          <div className="hud-value">{Math.round(distance)}m</div>
        </div>
      </div>

      {/* Speed */}
      <div className="hud-stat">
        <span style={{ fontSize: 18 }}>⚡</span>
        <div>
          <div className="hud-label">Speed</div>
          <div className="hud-value" style={{ color: '#7c3aed' }}>{speed.toFixed(1)}x</div>
        </div>
      </div>

      {/* Police proximity bar */}
      <div className="hud-stat police-bar-container" style={{ flex: 1, maxWidth: 240 }}>
        <div className="police-bar-label">
          <span>🐱 Tom</span>
          <span style={{ color: barColor }}>{pct}%</span>
        </div>
        <div className="police-bar-track">
          <div
            className="police-bar-fill"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, #22c55e, ${barColor})`,
              boxShadow: pct > 70 ? `0 0 8px ${barColor}` : 'none',
            }}
          />
        </div>
      </div>

      {/* Spacer */}
      <div className="hud-spacer" style={{ flex: 1 }} />

      {/* Wrong counter */}
      <div className="hud-stat">
        <div className="hud-label" style={{ marginRight: 4 }}>Lives</div>
        <div className="wrong-counter">
          {[0, 1, 2].map(i => (
            <div key={i} className={`wrong-dot ${i < wrongCount ? 'filled' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

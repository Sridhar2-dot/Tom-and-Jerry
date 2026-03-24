import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { executeCode } from '../api';

const CIRCUMFERENCE = 2 * Math.PI * 45;

// Time limits per difficulty
const DIFFICULTY_TIME = { easy: 30, medium: 45, hard: 60 };

export default function QuestionPanel({ question, onResult, onTimeout }) {
  const timeLimit = DIFFICULTY_TIME[question?.difficulty] ?? question?.timeLimit ?? 20;
  const [code, setCode] = useState(question?.starterCode || '');
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [output, setOutput] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    setCode(question?.starterCode || '');
    setTimeLeft(DIFFICULTY_TIME[question?.difficulty] ?? question?.timeLimit ?? 20);
    setOutput(null);
    setSubmitting(false);
  }, [question?.id]);

  useEffect(() => {
    if (!question) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          onTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [question?.id]);

  const handleSubmit = async () => {
    if (submitting || !code.trim()) return;
    clearInterval(timerRef.current);
    setSubmitting(true);
    setOutput(null);
    try {
      const result = await executeCode(code, question.id);
      setOutput(result);
      setTimeout(() => onResult(result.passed, result), 1000);
    } catch (e) {
      const err = { passed: false, error: e.message || 'Server error', output: '' };
      setOutput(err);
      setTimeout(() => onResult(false, err), 1000);
    }
  };

  const timerProgress = CIRCUMFERENCE * (1 - timeLeft / timeLimit);
  const timerColor =
    timeLeft > timeLimit * 0.5 ? '#00d4ff' :
    timeLeft > timeLimit * 0.25 ? '#eab308' : '#ef4444';
  const diffClass = `difficulty-${question?.difficulty || 'easy'}`;

  return (
    <div className="question-side-panel">
      {/* ── Header ── */}
      <div className="qp-header">
        <span className={`difficulty-badge ${diffClass}`}>{question?.difficulty?.toUpperCase()}</span>
        <div className="qp-title">{question?.title}</div>
      </div>

      {/* ── Timer + description ── */}
      <div className="qp-meta">
        {/* Timer ring */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <svg className="timer-svg" width="84" height="84" viewBox="0 0 84 84" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="42" cy="42" r="35" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
            <circle
              cx="42" cy="42" r="35"
              fill="none"
              stroke={timerColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 35}
              strokeDashoffset={2 * Math.PI * 35 * (1 - timeLeft / timeLimit)}
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
            />
            <text
              x="42" y="42"
              textAnchor="middle"
              dominantBaseline="central"
              fill={timerColor}
              style={{ fontSize: 20, fontWeight: 900, fontFamily: 'Fredoka One, cursive', transform: 'rotate(90deg)', transformOrigin: '42px 42px' }}
            >
              {timeLeft}
            </text>
          </svg>
          <span className="timer-label-small" style={{ fontSize: 9, color: '#475569', textTransform: 'uppercase', letterSpacing: 1 }}>secs left</span>
        </div>

        {/* Description */}
        <div className="question-desc" style={{ flex: 1 }}>{question?.description}</div>
      </div>

      {/* ── Output / feedback ── */}
      {output && (
        <div style={{
          margin: '0 0 8px 0',
          padding: '10px 14px',
          borderRadius: 10,
          background: output.passed ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${output.passed ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
          fontSize: 12,
          fontFamily: 'Space Mono, monospace',
          color: output.passed ? '#22c55e' : '#ef4444',
          wordBreak: 'break-all',
        }}>
          {output.passed ? '✅ Correct!' : `❌ ${output.error || `Got: "${output.output}"`}`}
        </div>
      )}

      {/* ── Editor (fills remaining space) ── */}
      <div style={{ flex: 1, minHeight: 0, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 12px', background: '#0d1117', borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'Space Mono, monospace' }}>🐍 Python</span>
          <button
            className={`btn btn-sm ${output ? (output.passed ? 'btn-success' : 'btn-danger') : 'btn-primary'}`}
            onClick={handleSubmit}
            disabled={submitting}
            style={{ minWidth: 120 }}
          >
            {submitting ? '⏳ Running...' : output ? (output.passed ? '✅ Correct!' : '❌ Try again') : '▶ Run & Submit'}
          </button>
        </div>
        <div style={{ height: 'calc(100% - 42px)' }}>
          <Editor
            height="100%"
            defaultLanguage="python"
            value={code}
            onChange={v => setCode(v || '')}
            theme="hc-black"
            options={{
              fontSize: 16, // Better for mobile reading/typing
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              lineNumbers: 'on',
              automaticLayout: true,
              padding: { top: 12, bottom: 12 },
              fontFamily: "'Space Mono', 'Consolas', monospace",
              cursorBlinking: 'smooth',
              tabSize: 4,
            }}
          />
        </div>
      </div>
    </div>
  );
}

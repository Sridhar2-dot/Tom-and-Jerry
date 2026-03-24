import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';

export default function GameCanvas({ running, playerSpeed, policeProximity, shake }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    frame: 0,
    bgOffset: 0,
    buildOffset: 0,
    roadOffset: 0,
    buildOffset: 0,
    roadOffset: 0,
    trees: [],
    canvasWidth: 800,
    canvasHeight: 400,
  });

  useEffect(() => {
    stateRef.current.trees = getTrees(1600);
  }, []);

  const draw = useCallback((delta) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const s = stateRef.current;

    s.frame += 1;
    const speed = playerSpeed * 260 * delta;
    s.bgOffset = (s.bgOffset + speed * 0.1) % W;
    s.buildOffset = (s.buildOffset + speed * 0.35) % (W + 1000);
    s.roadOffset = (s.roadOffset + speed) % 150;

    // Sky - Cartoon Day
    const sky = ctx.createLinearGradient(0, 0, 0, H * 0.75);
    sky.addColorStop(0, '#87CEEB'); // Light Blue
    sky.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Simple Clouds
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 5; i++) {
      const cx = (i * 300 + s.bgOffset * 0.2) % (W + 200) - 100;
      const cy = 50 + (i * 30) % 100;
      ctx.beginPath();
      ctx.arc(cx, cy, 40, 0, Math.PI * 2);
      ctx.arc(cx + 30, cy - 20, 50, 0, Math.PI * 2);
      ctx.arc(cx + 60, cy, 40, 0, Math.PI * 2);
      ctx.fill();
    }

    // Parallax Trees/Bushes
    const groundY = H * 0.82;
    const viewScale = H < 400 ? H / 400 : 1;
    const drawTrees = (xOff) => {
      s.trees.forEach(t => {
        const tx = t.x - s.buildOffset + xOff;
        const tw = t.w * viewScale;
        const th = t.h * viewScale;
        if (tx + tw < 0 || tx > W) return;
        const ty = groundY - th;
        
        // Brown trunk
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(tx + tw/2 - 10 * viewScale, ty + th - 40 * viewScale, 20 * viewScale, 40 * viewScale);
        
        // Green leaves (cartoon circular)
        ctx.fillStyle = t.color;
        ctx.beginPath();
        ctx.arc(tx + tw/2, ty + 20 * viewScale, tw/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.beginPath();
        ctx.arc(tx + tw/2, ty + 25 * viewScale, tw/2, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    drawTrees(0);
    drawTrees(W + 1000);

    // Ground - Grass
    ctx.fillStyle = '#7CFC00'; // LawnGreen
    ctx.fillRect(0, groundY - 20, W, H - groundY + 20);
    ctx.strokeStyle = '#32CD32'; // LimeGreen border
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, groundY - 20);
    ctx.lineTo(W, groundY - 20);
    ctx.stroke();

    // The Path - Dirt road
    ctx.fillStyle = '#DEB887'; // Burlywood dirt
    ctx.fillRect(0, groundY, W, H - groundY);
    ctx.strokeStyle = '#D2B48C';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(W, groundY);
    ctx.stroke();

    // Wooden planks/stripes for speed effect
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 6;
    ctx.setLineDash([40, 80]);
    ctx.lineDashOffset = -s.roadOffset;
    ctx.beginPath();
    ctx.moveTo(0, groundY + (H-groundY)*0.45);
    ctx.lineTo(W, groundY + (H-groundY)*0.45);
    ctx.stroke();
    ctx.setLineDash([]);

    // Speed particles (dust instead of neon)
    if (playerSpeed > 1.2) {
      ctx.fillStyle = 'rgba(210, 180, 140, 0.6)'; // Tan dust
      for (let i = 0; i < 8; i++) {
        const px = Math.random() * W;
        const py = groundY + Math.random() * (H - groundY);
        const pSize = Math.random() * 6 + 4;
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [playerSpeed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      stateRef.current.canvasWidth = canvas.width;
      stateRef.current.canvasHeight = canvas.height;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);
    return () => ro.disconnect();
  }, []);

  useGameLoop(draw, running);

  // Position logic for GIF overlays
  const canvasW = stateRef.current.canvasWidth;
  const canvasH = stateRef.current.canvasHeight;
  const globalScale = canvasH < 400 ? canvasH / 400 : 1;
  const groundY = canvasH * 0.82;
  const thiefX = canvasW * 0.75;
  const maxDist = canvasW * 0.65;
  const currentDist = maxDist * (1 - policeProximity);
  const policeX = thiefX - currentDist;
  const jerrySize = 104 * globalScale; // 130 reduced by 20%
  const tomSize = 189 * globalScale;   // 210 reduced by 10%
  const caughtSize = 196 * globalScale; // 280 reduced by 30%

  const jerryY = groundY - jerrySize + (15 * globalScale);
  const tomY = groundY - tomSize + (45 * globalScale); // Moved down further
  const caughtY = groundY - caughtSize + (25 * globalScale); // Slight offset so it sits properly

  return (
    <div className="canvas-container" style={{ width: '100%', height: '100%', background: '#87CEEB', position: 'relative', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      
      {policeProximity >= 0.99 ? (
        /* ── Caught GIF ── */
        <img 
          src="/caught.gif" 
          alt="caught"
          style={{
            position: 'absolute',
            left: thiefX - caughtSize / 2,
            top: caughtY,
            width: caughtSize,
            height: caughtSize,
            pointerEvents: 'none',
          }}
          key="caught-gif"
        />
      ) : (
        <>
          {/* ── Jerry GIF ── */}
          <img 
            src="/jerry.gif" 
            alt="jerry"
            style={{
              position: 'absolute',
              left: thiefX - jerrySize / 2,
              top: jerryY,
              width: jerrySize,
              height: jerrySize,
              pointerEvents: 'none',
              transition: 'left 0.1s ease-out', // Smooth movement
              transform: `translateY(${Math.sin(stateRef.current.frame * 0.15) * 4}px)`,
            }}
            key="thief-gif"
          />

          {/* ── Tom GIF ── */}
          <img 
            src="/tom.gif" 
            alt="tom"
            style={{
              position: 'absolute',
              left: policeX - tomSize / 2,
              top: tomY,
              width: tomSize,
              height: tomSize,
              pointerEvents: 'none',
              transition: 'left 0.1s ease-out',
              transform: `translateY(${Math.sin(stateRef.current.frame * 0.15 + 1) * 4}px)`,
            }}
            key="police-gif"
          />
        </>
      )}

      {shake && (
        <div style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 100px rgba(239, 68, 68, 0.4)',
          pointerEvents: 'none',
          animation: 'shake 0.3s ease infinite'
        }} />
      )}
    </div>
  );
}

function getTrees(w) {
  const t = [];
  let x = 0;
  const colors = ['#32CD32', '#228B22', '#006400', '#9ACD32'];
  while (x < w) {
    const tw = 80 + Math.random() * 60;
    t.push({ 
      x, 
      w: tw, 
      h: 80 + Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
    x += tw + 40 + Math.random() * 100;
  }
  return t;
}

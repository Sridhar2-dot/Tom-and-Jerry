import { useRef, useCallback } from 'react';

export function useSound() {
  const audioCtxRef = useRef(null);

  const getCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtxRef.current;
  };

  const playTone = useCallback((frequency, type = 'sine', duration = 0.2, volume = 0.3, delay = 0) => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
      gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration + 0.01);
    } catch (e) { /* ignore */ }
  }, []);

  const playCorrect = useCallback(() => {
    playTone(523, 'triangle', 0.15, 0.4, 0);
    playTone(659, 'triangle', 0.15, 0.4, 0.1);
    playTone(784, 'triangle', 0.25, 0.4, 0.2);
  }, [playTone]);

  const playWrong = useCallback(() => {
    playTone(200, 'sawtooth', 0.15, 0.5, 0);
    playTone(150, 'sawtooth', 0.2, 0.5, 0.15);
  }, [playTone]);

  const playGameOver = useCallback(() => {
    playTone(400, 'sawtooth', 0.2, 0.6, 0);
    playTone(300, 'sawtooth', 0.2, 0.6, 0.2);
    playTone(200, 'sawtooth', 0.4, 0.6, 0.4);
  }, [playTone]);

  const playTick = useCallback(() => {
    playTone(800, 'square', 0.05, 0.1);
  }, [playTone]);

  return { playCorrect, playWrong, playGameOver, playTick };
}

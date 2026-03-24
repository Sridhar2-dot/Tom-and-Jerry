import { useEffect, useRef, useCallback } from 'react';

export function useGameLoop(callback, running) {
  const rafRef = useRef(null);
  const lastTimestampRef = useRef(null);
  const callbackRef = useRef(callback);

  useEffect(() => { callbackRef.current = callback; }, [callback]);

  const loop = useCallback((timestamp) => {
    if (lastTimestampRef.current === null) {
      lastTimestampRef.current = timestamp;
    }
    const delta = Math.min((timestamp - lastTimestampRef.current) / 1000, 0.1);
    lastTimestampRef.current = timestamp;
    callbackRef.current(delta, timestamp);
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (running) {
      lastTimestampRef.current = null;
      rafRef.current = requestAnimationFrame(loop);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [running, loop]);
}

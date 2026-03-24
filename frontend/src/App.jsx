import React, { useState } from 'react';
import MenuScreen from './components/MenuScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import './index.css';

export default function App() {
  const [screen, setScreen] = useState('MENU'); // MENU | PLAYING | GAMEOVER
  const [difficulty, setDifficulty] = useState('easy');
  const [lastResult, setLastResult] = useState({ score: 0, distance: 0 });

  const handlePlay = (diff) => {
    setDifficulty(diff);
    setScreen('PLAYING');
  };

  const handleGameOver = ({ score, distance }) => {
    setLastResult({ score, distance });
    setScreen('GAMEOVER');
  };

  const handleRestart = () => {
    setScreen('MENU');
  };

  return (
    <>
      {screen === 'MENU' && (
        <MenuScreen onPlay={handlePlay} />
      )}
      {screen === 'PLAYING' && (
        <GameScreen
          key={`game-${Date.now()}`}
          difficulty={difficulty}
          onGameOver={handleGameOver}
        />
      )}
      {screen === 'GAMEOVER' && (
        <GameOverScreen
          score={lastResult.score}
          distance={lastResult.distance}
          difficulty={difficulty}
          onRestart={handleRestart}
        />
      )}
    </>
  );
}

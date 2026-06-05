import { useState, useEffect } from 'react';
import { Home } from './components/pages/Home';
import { Game } from './components/pages/Game';
import { SkillTest } from './components/pages/SkillTest';
import { GameMode, Character, Weapon } from './types';

function App() {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [p1Char, setP1Char] = useState<Character | null>(null);
  const [p2Char, setP2Char] = useState<Character | null>(null);
  const [p1Weapon, setP1Weapon] = useState<Weapon | null>(null);
  const [p2Weapon, setP2Weapon] = useState<Weapon | null>(null);
  const [aiDifficulty, setAiDifficulty] = useState<number>(2);
  const [showSkillTest, setShowSkillTest] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('test') === 'skills') {
      setShowSkillTest(true);
    }
  }, []);

  const handleStartGame = (
    mode: GameMode,
    player1Char: Character,
    player2Char: Character,
    player1Weapon: Weapon | null,
    player2Weapon: Weapon | null,
    difficulty: number
  ) => {
    setGameMode(mode);
    setP1Char(player1Char);
    setP2Char(player2Char);
    setP1Weapon(player1Weapon);
    setP2Weapon(player2Weapon);
    setAiDifficulty(difficulty);
  };

  const handleBack = () => {
    setGameMode(null);
    setP1Char(null);
    setP2Char(null);
    setP1Weapon(null);
    setP2Weapon(null);
  };

  if (showSkillTest) {
    return <SkillTest />;
  }

  if (!gameMode || !p1Char || !p2Char) {
    return <Home onStartGame={handleStartGame} />;
  }

  return (
    <Game
      mode={gameMode}
      p1Char={p1Char}
      p2Char={p2Char}
      p1Weapon={p1Weapon}
      p2Weapon={p2Weapon}
      aiDifficulty={aiDifficulty}
      onBack={handleBack}
    />
  );
}

export default App;

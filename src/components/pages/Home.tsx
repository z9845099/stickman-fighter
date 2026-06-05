import { useState, useEffect } from 'react';
import { GameMode, Character, Weapon } from '../../types';
import { GAME_MODES } from '../../utils/constants';
import { getCharacters, getWeapons } from '../../utils/dataLoader';

const DIFFICULTY_KEY = 'huochairen_ai_difficulty';

interface HomeProps {
  onStartGame: (mode: GameMode, p1Char: Character, p2Char: Character, p1Weapon: Weapon | null, p2Weapon: Weapon | null, aiDifficulty: number) => void;
}

export function Home({ onStartGame }: HomeProps) {
  const characters = getCharacters();
  const weapons = getWeapons();
  
  const [selectedMode, setSelectedMode] = useState<GameMode>('single');
  const [selectedP1Char, setSelectedP1Char] = useState<Character>(characters[0]);
  const [selectedP2Char, setSelectedP2Char] = useState<Character>(characters[1]);
  const [selectedP1Weapon, setSelectedP1Weapon] = useState<Weapon | null>(null);
  const [selectedP2Weapon, setSelectedP2Weapon] = useState<Weapon | null>(null);
  
  const [aiDifficulty, setAiDifficulty] = useState<number>(() => {
    const saved = localStorage.getItem(DIFFICULTY_KEY);
    return saved ? parseInt(saved, 10) : 2;
  });

  useEffect(() => {
    localStorage.setItem(DIFFICULTY_KEY, aiDifficulty.toString());
  }, [aiDifficulty]);

  const handleStartGame = () => {
    onStartGame(selectedMode, selectedP1Char, selectedP2Char, selectedP1Weapon, selectedP2Weapon, aiDifficulty);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-2" style={{ textShadow: '0 0 30px rgba(74, 144, 217, 0.5)' }}>
          🔥 火柴人格斗 🔥
        </h1>
        <p className="text-gray-400">大动作幅度战斗系统</p>
      </div>

      <div className="glass-card p-6 mb-6" style={{ minWidth: '600px' }}>
        <h2 className="text-xl font-bold text-white mb-4 text-center">选择游戏模式</h2>
        <div className="grid grid-cols-3 gap-4">
          {GAME_MODES.map(({ mode, label, description }) => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`p-4 rounded-lg transition-all duration-300 ${
                selectedMode === mode
                  ? 'bg-blue-600 text-white scale-105'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="font-bold">{label}</div>
              <div className="text-xs opacity-80">{description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <div className="relative">
          <select
            value={aiDifficulty}
            onChange={(e) => setAiDifficulty(Number(e.target.value))}
            className="appearance-none bg-gray-700 text-white text-sm px-3 py-2 pr-6 rounded-lg border border-gray-600 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            style={{ minWidth: '110px' }}
          >
            <option value="1">🌱 简单</option>
            <option value="2">🌿 普通</option>
            <option value="3">🔥 困难</option>
            <option value="4">💀 专家</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 text-xs">
            ▼
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-4">玩家1</h3>
          
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">选择角色</div>
            <div className="flex flex-wrap gap-2">
              {characters.map((char) => (
                <button
                  key={char.id}
                  onClick={() => setSelectedP1Char(char)}
                  className={`p-3 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    selectedP1Char.id === char.id
                      ? 'scale-110 ring-2 ring-white'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: char.color }}
                >
                  <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{char.name[0]}</span>
                  </div>
                  <span className="text-white text-sm">{char.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-400 mb-2">选择武器</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedP1Weapon(null)}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  selectedP1Weapon === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                默认
              </button>
              {weapons.map((weapon) => (
                <button
                  key={weapon.id}
                  onClick={() => setSelectedP1Weapon(weapon)}
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    selectedP1Weapon?.id === weapon.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {weapon.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-4">玩家2</h3>
          
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">选择角色</div>
            <div className="flex flex-wrap gap-2">
              {characters.map((char) => (
                <button
                  key={char.id}
                  onClick={() => setSelectedP2Char(char)}
                  className={`p-3 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    selectedP2Char.id === char.id
                      ? 'scale-110 ring-2 ring-white'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: char.color }}
                >
                  <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{char.name[0]}</span>
                  </div>
                  <span className="text-white text-sm">{char.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-400 mb-2">选择武器</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedP2Weapon(null)}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  selectedP2Weapon === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                默认
              </button>
              {weapons.map((weapon) => (
                <button
                  key={weapon.id}
                  onClick={() => setSelectedP2Weapon(weapon)}
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    selectedP2Weapon?.id === weapon.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {weapon.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button className="btn-game text-xl px-12 py-4" onClick={handleStartGame}>
        🎮 开始战斗
      </button>
    </div>
  );
}

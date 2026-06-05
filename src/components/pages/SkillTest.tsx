import { useEffect, useRef, useState } from 'react';
import { Player } from '../../game/Player';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../utils/constants';
import { getCharacters } from '../../utils/dataLoader';
import { Character } from '../../types';

export function SkillTest() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const log = (message: string) => {
    setDebugLog(prev => [...prev.slice(-10), message]);
    console.log(message);
  };

  useEffect(() => {
    const characters = getCharacters();
    if (!characters || characters.length === 0) {
      log('Error: No characters found');
      return;
    }

    const warrior = characters.find((c: Character) => c.id === 'warrior') || characters[0];
    playerRef.current = new Player(warrior, null, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    log(`Player created: ${warrior.name}`);
    log(`Skills: ${playerRef.current.state.character.skills.join(', ')}`);
    log(`Energy: ${playerRef.current.state.energy}`);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      if (!playerRef.current) return;

      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      playerRef.current.update(16.67);
      playerRef.current.state.position.x += playerRef.current.state.velocity.x;
      playerRef.current.state.position.y += playerRef.current.state.velocity.y;
      playerRef.current.state.velocity.x *= 0.92;
      playerRef.current.state.velocity.y *= 0.92;

      playerRef.current.draw(ctx);
      requestAnimationFrame(gameLoop);
    };

    gameLoop();
  }, []);

  const handleSkill1 = () => {
    if (!playerRef.current) {
      log('Player not ready');
      return;
    }

    const skills = playerRef.current.state.character.skills;
    if (skills.length === 0) {
      log('No skills available');
      return;
    }

    log(`Trying to use skill1: ${skills[0]}`);
    log(`Current state: ${playerRef.current.state.state}`);
    log(`Energy: ${playerRef.current.state.energy}`);

    if (playerRef.current.canUseSkill(skills[0])) {
      log('Skill can be used!');
      playerRef.current.performSkill(skills[0]);
      log(`Skill performed! New state: ${playerRef.current.state.state}`);
      log(`Energy after: ${playerRef.current.state.energy}`);
    } else {
      log('Cannot use skill (check state/energy/cooldown)');
    }
  };

  const handleSkill2 = () => {
    if (!playerRef.current) {
      log('Player not ready');
      return;
    }

    const skills = playerRef.current.state.character.skills;
    if (skills.length < 2) {
      log('No skill2 available');
      return;
    }

    log(`Trying to use skill2: ${skills[1]}`);
    log(`Current state: ${playerRef.current.state.state}`);
    log(`Energy: ${playerRef.current.state.energy}`);

    if (playerRef.current.canUseSkill(skills[1])) {
      log('Skill can be used!');
      playerRef.current.performSkill(skills[1]);
      log(`Skill performed! New state: ${playerRef.current.state.state}`);
      log(`Energy after: ${playerRef.current.state.energy}`);
    } else {
      log('Cannot use skill (check state/energy/cooldown)');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      log(`Key pressed: ${e.code}`);
      
      if (e.code === 'KeyQ') {
        handleSkill1();
      } else if (e.code === 'KeyE') {
        handleSkill2();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl text-white mb-4">技能测试页面</h1>
      
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-2 border-gray-700 rounded"
      />

      <div className="mt-4 flex gap-4">
        <button
          onClick={handleSkill1}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xl"
        >
          Q - 技能1
        </button>
        <button
          onClick={handleSkill2}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xl"
        >
          E - 技能2
        </button>
      </div>

      <div className="mt-4 p-4 bg-gray-800 rounded-lg w-full max-w-2xl">
        <h3 className="text-white mb-2">调试日志</h3>
        <div className="text-xs text-gray-300 max-h-40 overflow-y-auto">
          {debugLog.map((log, index) => (
            <div key={index} className="mb-1">{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

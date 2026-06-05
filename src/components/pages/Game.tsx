import { useEffect, useRef, useState, useCallback } from 'react';
import { GameMode, Character, Weapon } from '../../types';
import { Player } from '../../game/Player';
import { AdvancedAI } from '../../game/AdvancedAI';
import { Obstacle as ObstacleClass, OBSTACLES_CONFIG } from '../../game/Obstacle';
import { HealthBar } from '../ui/HealthBar';
import { EnergyBar } from '../ui/EnergyBar';
import { Timer } from '../ui/Timer';
import { Player1Controls } from '../ui/Player1Controls';
import { Player2Controls } from '../ui/Player2Controls';
import { useGameLoop } from '../../hooks/useGameLoop';
import { P1_KEYS, P2_KEYS, CANVAS_WIDTH, CANVAS_HEIGHT } from '../../utils/constants';
import { getGameConfig } from '../../utils/dataLoader';

const CONFIG = getGameConfig();

interface GameProps {
  mode: GameMode;
  p1Char: Character;
  p2Char: Character;
  p1Weapon: Weapon | null;
  p2Weapon: Weapon | null;
  aiDifficulty: number;
  onBack: () => void;
}

export function Game({ mode, p1Char, p2Char, p1Weapon, p2Weapon, aiDifficulty, onBack }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const player1Ref = useRef<Player | null>(null);
  const player2Ref = useRef<Player | null>(null);
  const ai1Ref = useRef<AdvancedAI | null>(null);
  const ai2Ref = useRef<AdvancedAI | null>(null);
  const obstaclesRef = useRef<ObstacleClass[]>([]);

  const [isRunning, setIsRunning] = useState(false);
  const [winner, setWinner] = useState<'player1' | 'player2' | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(CONFIG.gameTime);
  const [showCountdown, setShowCountdown] = useState(3);
  const [screenShake, setScreenShake] = useState(0);
  const [showDebug, setShowDebug] = useState(true);

  const resetGame = useCallback(() => {
    player1Ref.current = new Player(p1Char, p1Weapon, 150, CANVAS_HEIGHT / 2);
    player2Ref.current = new Player(p2Char, p2Weapon, CANVAS_WIDTH - 150, CANVAS_HEIGHT / 2);

    obstaclesRef.current = OBSTACLES_CONFIG.map(obs => new ObstacleClass(obs));

    if (mode === 'ai' || mode === 'single') {
      ai2Ref.current = new AdvancedAI(player2Ref.current, player1Ref.current, aiDifficulty);
    }
    if (mode === 'ai') {
      ai1Ref.current = new AdvancedAI(player1Ref.current, player2Ref.current, aiDifficulty);
    }

    setIsRunning(false);
    setWinner(null);
    setTimeRemaining(CONFIG.gameTime);
    setShowCountdown(3);
    setScreenShake(0);
  }, [p1Char, p2Char, p1Weapon, p2Weapon, mode, aiDifficulty]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    if (showCountdown > 0) {
      const timer = setTimeout(() => {
        setShowCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown === 0 && !isRunning && !winner) {
      setIsRunning(true);
    }
  }, [showCountdown, isRunning, winner]);

  useEffect(() => {
    if (!isRunning || winner) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          if (player1Ref.current && player2Ref.current) {
            const p1Hp = player1Ref.current.state.hp;
            const p2Hp = player2Ref.current.state.hp;
            if (p1Hp > p2Hp) {
              setWinner('player1');
            } else if (p2Hp > p1Hp) {
              setWinner('player2');
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, winner]);

  const checkPlayerCollision = (player1: Player, player2: Player) => {
    const dx = player2.state.position.x - player1.state.position.x;
    const dy = player2.state.position.y - player1.state.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = 40;

    if (distance < minDistance && distance > 0) {
      const overlap = minDistance - distance;
      const nx = dx / distance;
      const ny = dy / distance;

      player1.state.position.x -= nx * overlap * 0.5;
      player1.state.position.y -= ny * overlap * 0.5;
      player2.state.position.x += nx * overlap * 0.5;
      player2.state.position.y += ny * overlap * 0.5;

      player1.state.velocity.x -= nx * 2;
      player1.state.velocity.y -= ny * 2;
      player2.state.velocity.x += nx * 2;
      player2.state.velocity.y += ny * 2;
    }
  };

  const checkAttackCollision = (player: Player, opponent: Player) => {
    if (!player.isAttackActive()) return;

    const attack = player.getAttackHitbox();
    if (!attack) return;

    const hitbox = opponent.getHitbox();

    if (
      attack.x < hitbox.x + hitbox.width &&
      attack.x + attack.width > hitbox.x &&
      attack.y < hitbox.y + hitbox.height &&
      attack.y + attack.height > hitbox.y
    ) {
      opponent.takeDamage(attack.damage, player.state.position);
      player.attackHitbox = null;
      
      if (attack.damage > 30) {
        setScreenShake(8);
      }

      if (opponent.state.hp <= 0) {
        setIsRunning(false);
        setWinner(player === player1Ref.current ? 'player1' : 'player2');
      }
    }
  };

  const checkProjectileCollision = (player: Player, opponent: Player) => {
    const projectiles = player.getProjectiles();
    projectiles.forEach(projectile => {
      if (!projectile.isActive) return;

      const hitbox = opponent.getHitbox();

      if (
        projectile.position.x < hitbox.x + hitbox.width &&
        projectile.position.x > hitbox.x &&
        projectile.position.y < hitbox.y + hitbox.height &&
        projectile.position.y > hitbox.y
      ) {
        opponent.takeDamage(projectile.damage, player.state.position);
        projectile.isActive = false;
        player.removeProjectile(projectile.id);

        if (opponent.state.hp <= 0) {
          setIsRunning(false);
          setWinner(player === player1Ref.current ? 'player1' : 'player2');
        }
      }
    });
  };

  const gameLoop = useCallback(() => {
    if (!player1Ref.current || !player2Ref.current) return;

    const p1 = player1Ref.current;
    const p2 = player2Ref.current;
    
    if (p1 && p1.state.state !== 'dead') {
      p1.state.facing = p2.state.position.x > p1.state.position.x ? 'right' : 'left';
    }
    if (p2 && p2.state.state !== 'dead') {
      p2.state.facing = p1.state.position.x > p2.state.position.x ? 'right' : 'left';
    }

    if (mode === 'ai') {
      ai1Ref.current?.update();
      ai2Ref.current?.update();
    } else if (mode === 'single') {
      ai2Ref.current?.update();
    }

    player1Ref.current.update(16.67);
    player2Ref.current.update(16.67);

    player1Ref.current.state.position.x += player1Ref.current.state.velocity.x;
    player1Ref.current.state.position.y += player1Ref.current.state.velocity.y;
    player2Ref.current.state.position.x += player2Ref.current.state.velocity.x;
    player2Ref.current.state.position.y += player2Ref.current.state.velocity.y;

    checkPlayerCollision(player1Ref.current, player2Ref.current);

    player1Ref.current.state.velocity.x *= 0.92;
    player1Ref.current.state.velocity.y *= 0.92;
    player2Ref.current.state.velocity.x *= 0.92;
    player2Ref.current.state.velocity.y *= 0.92;

    const padding = 80;
    player1Ref.current.state.position.x = Math.max(padding, Math.min(CANVAS_WIDTH - padding, player1Ref.current.state.position.x));
    player1Ref.current.state.position.y = Math.max(padding, Math.min(CANVAS_HEIGHT - padding, player1Ref.current.state.position.y));
    player2Ref.current.state.position.x = Math.max(padding, Math.min(CANVAS_WIDTH - padding, player2Ref.current.state.position.x));
    player2Ref.current.state.position.y = Math.max(padding, Math.min(CANVAS_HEIGHT - padding, player2Ref.current.state.position.y));

    checkAttackCollision(player1Ref.current, player2Ref.current);
    checkAttackCollision(player2Ref.current, player1Ref.current);

    checkProjectileCollision(player1Ref.current, player2Ref.current);
    checkProjectileCollision(player2Ref.current, player1Ref.current);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < CANVAS_WIDTH; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let i = 0; i < CANVAS_HEIGHT; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_WIDTH, i);
      ctx.stroke();
    }

    obstaclesRef.current.forEach(obstacle => obstacle.draw(ctx));

    player1Ref.current.draw(ctx);
    player2Ref.current.draw(ctx);

    if (player1Ref.current.getScreenShake() > 0) {
      setScreenShake(player1Ref.current.getScreenShake());
    }
    if (player2Ref.current.getScreenShake() > 0) {
      setScreenShake(player2Ref.current.getScreenShake());
    }
  }, [mode]);

  useGameLoop(gameLoop, isRunning);

  useEffect(() => {
    if (screenShake > 0) {
      const timer = setTimeout(() => {
        setScreenShake((prev) => Math.max(0, prev - 1));
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [screenShake]);

  useEffect(() => {
    console.log(`[DEBUG] Keyboard event listener mounted, mode: ${mode}`);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(`[DEBUG] Keydown event received: ${e.code}`);
      
      const p1 = player1Ref.current;
      const p2 = player2Ref.current;
      
      if (!p1) {
        console.log('[DEBUG] player1Ref is null');
        return;
      }
      if (!p2) {
        console.log('[DEBUG] player2Ref is null');
        return;
      }
      
      const currentIsRunning = isRunning;
      const currentShowCountdown = showCountdown;
      const currentWinner = winner;
      const currentMode = mode;
      
      console.log(`[DEBUG] isRunning: ${currentIsRunning}, showCountdown: ${currentShowCountdown}, winner: ${currentWinner}`);
      
      if (!currentIsRunning && currentShowCountdown === 0 && !currentWinner) {
        console.log('[DEBUG] Starting game');
        setIsRunning(true);
      }

      if (currentMode !== 'ai') {
        console.log(`[DEBUG] Processing P1 input`);
        console.log(`[DEBUG] P1 state: ${p1.state.state}, energy: ${p1.state.energy}`);
        console.log(`[DEBUG] P1 skills: ${p1.state.character.skills.join(', ')}`);
        
        if (e.code === P1_KEYS.up) p1.input.up = true;
        if (e.code === P1_KEYS.down) p1.input.down = true;
        if (e.code === P1_KEYS.left) p1.input.left = true;
        if (e.code === P1_KEYS.right) p1.input.right = true;
        if (e.code === P1_KEYS.attack) p1.input.attack = true;
        
        if (e.code === P1_KEYS.skill1) {
          console.log('[DEBUG] Q key pressed!');
          const skills = p1.state.character.skills;
          if (skills.length > 0) {
            if (p1.canUseSkill(skills[0])) {
              console.log('[DEBUG] Releasing skill1: ' + skills[0]);
              p1.performSkill(skills[0]);
            } else {
              console.log('[DEBUG] Cannot use skill1 - check energy/cooldown');
            }
          }
        }
        if (e.code === P1_KEYS.skill2) {
          console.log('[DEBUG] E key pressed!');
          const skills = p1.state.character.skills;
          if (skills.length > 1) {
            if (p1.canUseSkill(skills[1])) {
              console.log('[DEBUG] Releasing skill2: ' + skills[1]);
              p1.performSkill(skills[1]);
            } else {
              console.log('[DEBUG] Cannot use skill2 - check energy/cooldown');
            }
          }
        }
        
        if (e.code === 'KeyS') p1.input.block = true;
        if (e.code === 'Space') { e.preventDefault(); p1.input.dodge = true; }
      }

      if (currentMode === 'multiplayer') {
        if (e.code === P2_KEYS.up) p2.input.up = true;
        if (e.code === P2_KEYS.down) p2.input.down = true;
        if (e.code === P2_KEYS.left) p2.input.left = true;
        if (e.code === P2_KEYS.right) p2.input.right = true;
        if (e.code === P2_KEYS.attack) p2.input.attack = true;
        if (e.code === 'Slash') p2.input.block = true;
        if (e.code === 'Enter') { p2.input.dodge = true; }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const p1 = player1Ref.current;
      const p2 = player2Ref.current;
      
      if (!p1 || !p2) return;

      if (mode !== 'ai') {
        if (e.code === P1_KEYS.up) p1.input.up = false;
        if (e.code === P1_KEYS.down) p1.input.down = false;
        if (e.code === P1_KEYS.left) p1.input.left = false;
        if (e.code === P1_KEYS.right) p1.input.right = false;
        if (e.code === P1_KEYS.attack) p1.input.attack = false;
        if (e.code === 'KeyS') p1.input.block = false;
        if (e.code === 'Space') p1.input.dodge = false;
      }

      if (mode === 'multiplayer') {
        if (e.code === P2_KEYS.up) p2.input.up = false;
        if (e.code === P2_KEYS.down) p2.input.down = false;
        if (e.code === P2_KEYS.left) p2.input.left = false;
        if (e.code === P2_KEYS.right) p2.input.right = false;
        if (e.code === P2_KEYS.attack) p2.input.attack = false;
        if (e.code === 'Slash') p2.input.block = false;
        if (e.code === 'Enter') p2.input.dodge = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    console.log('[DEBUG] Keyboard event listeners added');

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      console.log('[DEBUG] Keyboard event listeners removed');
    };
  }, [mode]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="glass-card p-4 mb-4" style={{ maxWidth: CANVAS_WIDTH + 200 }}>
        <div className="flex items-center justify-between w-full mb-4" style={{ maxWidth: CANVAS_WIDTH }}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <HealthBar
                current={player1Ref.current?.state.hp || 0}
                max={p1Char.stats.maxHp}
                label="P1"
                color={p1Char.color}
                isLeft
              />
              <span className="text-xs text-gray-400 ml-2">{p1Weapon?.name || '拳头'}</span>
            </div>
            <EnergyBar
              current={player1Ref.current?.state.energy || 0}
              max={p1Char.stats.maxEnergy}
              isLeft
            />
          </div>
          <Timer timeRemaining={timeRemaining} />
          <div className="flex flex-col gap-2 items-end">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 mr-2">{p2Weapon?.name || '拳头'}</span>
              <HealthBar
                current={player2Ref.current?.state.hp || 0}
                max={p2Char.stats.maxHp}
                label="P2"
                color={p2Char.color}
              />
            </div>
            <EnergyBar
              current={player2Ref.current?.state.energy || 0}
              max={p2Char.stats.maxEnergy}
            />
          </div>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="hidden lg:block">
          <Player1Controls />
        </div>

        <div 
          className="relative"
          style={{
            transform: screenShake > 0 ? `translate(${Math.sin(Date.now() / 30) * screenShake}px, ${Math.cos(Date.now() / 30) * screenShake}px)` : 'none',
          }}
        >
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="game-canvas"
          />

          {showCountdown > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <span className="text-9xl font-bold text-white text-glow">{showCountdown}</span>
            </div>
          )}

          {winner && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
              <span className="text-6xl font-bold text-glow mb-4" style={{ color: winner === 'player1' ? p1Char.color : p2Char.color }}>
                {winner === 'player1' ? 'P1 胜利!' : 'P2 胜利!'}
              </span>
              <div className="flex gap-4">
                <button className="btn-game" onClick={resetGame}>
                  再来一局
                </button>
                <button className="btn-game-secondary" onClick={onBack}>
                  返回主页
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <Player2Controls />
        </div>
      </div>

      {showDebug && (mode === 'ai' || mode === 'single') && (
        <div className="glass-card p-4 mt-4" style={{ maxWidth: CANVAS_WIDTH, width: '100%' }}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-bold">AI 性能调试面板</h3>
            <button 
              className="text-xs text-gray-400 hover:text-white" 
              onClick={() => setShowDebug(false)}
            >
              隐藏调试
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            {mode === 'ai' && ai1Ref.current && (
              <div className="space-y-1">
                <p className="text-white font-semibold" style={{ color: p1Char.color }}>
                  P1 AI ({['简单', '普通', '困难', '专家'][aiDifficulty - 1]})
                </p>
                <p className="text-gray-300">闪避尝试: {ai1Ref.current.getStats().dodgeAttempts}</p>
                <p className="text-gray-300">闪避成功: {ai1Ref.current.getStats().dodgeSuccesses}</p>
                <p className="text-green-400">闪避成功率: {ai1Ref.current.getStats().dodgeRate}%</p>
                <p className="text-gray-300">攻击次数: {ai1Ref.current.getStats().attackCount}</p>
                <p className="text-blue-300">当前动作: {ai1Ref.current.getStats().lastAction}</p>
              </div>
            )}
            
            {ai2Ref.current && (
              <div className="space-y-1">
                <p className="text-white font-semibold" style={{ color: p2Char.color }}>
                  {mode === 'ai' ? 'P2 AI' : '对手 AI'} ({['简单', '普通', '困难', '专家'][aiDifficulty - 1]})
                </p>
                <p className="text-gray-300">闪避尝试: {ai2Ref.current.getStats().dodgeAttempts}</p>
                <p className="text-gray-300">闪避成功: {ai2Ref.current.getStats().dodgeSuccesses}</p>
                <p className="text-green-400">闪避成功率: {ai2Ref.current.getStats().dodgeRate}%</p>
                <p className="text-gray-300">攻击次数: {ai2Ref.current.getStats().attackCount}</p>
                <p className="text-blue-300">当前动作: {ai2Ref.current.getStats().lastAction}</p>
              </div>
            )}
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-700">
            <p className="text-yellow-400 text-xs mb-1">AI 功能说明:</p>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• 决策间隔: {[10, 8, 5, 1][aiDifficulty - 1]}帧</li>
              <li>• 反击机制: 对手攻击后2-12帧内进行反击</li>
              <li>• 闪避限制: 连续3次闪避后强制攻击一次</li>
              <li>• 智能后退: 低血量时退到攻击范围外(130像素)</li>
              <li>• 异常处理: 血量归零后自动停止所有动作</li>
            </ul>
          </div>
        </div>
      )}

      {!showDebug && (
        <button 
          className="text-xs text-gray-500 mt-2 hover:text-white"
          onClick={() => setShowDebug(true)}
        >
          显示AI调试面板
        </button>
      )}

      <button className="btn-game-secondary mt-4" onClick={onBack}>
        返回主页
      </button>
    </div>
  );
}

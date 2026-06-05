import { GameMode } from '../types';

export const GAME_MODES: { mode: GameMode; label: string; description: string }[] = [
  { mode: 'single', label: '人机格斗', description: '玩家 vs AI' },
  { mode: 'multiplayer', label: '双人格斗', description: '玩家1 vs 玩家2' },
  { mode: 'ai', label: '机器格斗', description: 'AI vs AI' },
];

export const P1_KEYS = {
  up: 'KeyW',
  down: 'KeyS',
  left: 'KeyA',
  right: 'KeyD',
  attack: 'KeyF',
  skill1: 'KeyQ',
  skill2: 'KeyE',
};

export const P2_KEYS = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  attack: 'Period',
};

export const MOVEMENT_CONFIG = {
  acceleration: 0.4,
  deceleration: 0.85,
  minVelocity: 0.1,
};

export const KNOCKBACK_CONFIG = {
  baseKnockback: 30,
  knockbackScaling: 2,
  knockbackDuration: 300,
  maxKnockbackDistance: 100,
};

export const CHARACTER_RADIUS = 15;

export const CANVAS_WIDTH = 900;
export const CANVAS_HEIGHT = 600;
export const GROUND_Y = CANVAS_HEIGHT - 80;

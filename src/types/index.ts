export type GameMode = 'single' | 'multiplayer' | 'ai';

export interface CharacterStats {
  maxHp: number;
  maxEnergy: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface Character {
  id: string;
  name: string;
  color: string;
  stats: CharacterStats;
  skills: string[];
}

export interface Weapon {
  id: string;
  name: string;
  type: 'melee' | 'ranged';
  damageMultiplier: number;
  range: number;
  cooldown: number;
}

export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  attack: boolean;
  skill1: boolean;
  skill2: boolean;
  block: boolean;
  dodge: boolean;
}

export interface AttackHitbox {
  x: number;
  y: number;
  width: number;
  height: number;
  damage: number;
  isActive: boolean;
}

export interface CharacterState {
  character: Character;
  weapon: Weapon | null;
  hp: number;
  energy: number;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  facing: 'left' | 'right';
  state: 'idle' | 'running' | 'attacking' | 'hurt' | 'dead' | 'skill' | 'blocking' | 'dodging' | 'jumping' | 'rolling';
  attackFrame: number;
  hurtFrame: number;
  skillFrame: number;
  rollFrame: number;
  comboCount: number;
  lastComboTime: number;
  blockFrame: number;
  dodgeFrame: number;
  jumpFrame: number;
  currentSkill: Skill | null;
  cooldowns: Map<string, number>;
  isInvincible: boolean;
  knockback: {
    velocity: { x: number; y: number };
    duration: number;
    remaining: number;
    isActive: boolean;
  };
}

export interface Skill {
  id: string;
  name: string;
  damage: number;
  energyCost: number;
  cooldown: number;
  range: number;
  duration: number;
  type: 'normal' | 'ultimate';
  effects: string[];
}

export interface Projectile {
  id: string;
  ownerId: string;
  position: { x: number; y: number };
  prevPosition: { x: number; y: number };
  velocity: { x: number; y: number };
  damage: number;
  range: number;
  maxDistance: number;
  traveledDistance: number;
  isActive: boolean;
  weapon: Weapon;
  radius: number;
}

export interface Obstacle {
  id: string;
  type: 'wall' | 'crate' | 'pillar';
  position: { x: number; y: number };
  size: { width: number; height: number };
  color: string;
  borderColor: string;
  blocksMovement: boolean;
  blocksLineOfSight: boolean;
  coverBonus: number;
  hitbox?: { x: number; y: number; width: number; height: number };
}

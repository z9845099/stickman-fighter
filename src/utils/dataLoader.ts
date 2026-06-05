import gameData from '../data/gameData.json';
import { Character, Weapon, Skill } from '../types';

export function getGameConfig() {
  return gameData.config;
}

export function getCharacters(): Character[] {
  return gameData.characters as Character[];
}

export function getCharacterById(id: string): Character | undefined {
  return gameData.characters.find(c => c.id === id) as Character | undefined;
}

export function getWeapons(): Weapon[] {
  return gameData.weapons as Weapon[];
}

export function getWeaponById(id: string): Weapon | undefined {
  return gameData.weapons.find(w => w.id === id) as Weapon | undefined;
}

export function getSkills(): Skill[] {
  return gameData.skills as Skill[];
}

export function getSkillById(id: string): Skill | undefined {
  return gameData.skills.find(s => s.id === id) as Skill | undefined;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

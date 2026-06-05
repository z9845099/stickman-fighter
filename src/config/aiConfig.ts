export interface AIDifficultyConfig {
  dodgeChance: number;
  decisionInterval: number;
  counterAttackChance: number;
  aggressionMultiplier: number;
  
  attackRangeMultiplier: number;
  aggressiveHpThreshold: number;
  cautiousHpThreshold: number;
  
  highHpActionWeights: {
    attack: number;
    block: number;
    dodge: number;
  };
  
  midHpActionWeights: {
    attack: number;
    block: number;
    dodge: number;
  };
  
  lowHpActionWeights: {
    attack: number;
    block: number;
    dodge: number;
  };
}

export interface AIConfig {
  difficulties: Record<number, AIDifficultyConfig>;
  safeDistance: number;
  attackRange: number;
  minCollisionDistance: number;
  emergencyRetreatHpThreshold: number;
  consecutiveDodgeLimit: number;
  dodgeCooldownFrames: number;
  counterAttackWindowStart: number;
  counterAttackWindowEnd: number;
  emergencyRetreatDistance: number;
  emergencyRetreatSpeed: number;
}

export const aiConfig: AIConfig = {
  difficulties: {
    1: {
      dodgeChance: 0.3,
      decisionInterval: 10,
      counterAttackChance: 0.7,
      aggressionMultiplier: 0.8,
      attackRangeMultiplier: 1.0,
      aggressiveHpThreshold: 0.6,
      cautiousHpThreshold: 0.3,
      highHpActionWeights: { attack: 60, block: 20, dodge: 20 },
      midHpActionWeights: { attack: 50, block: 25, dodge: 25 },
      lowHpActionWeights: { attack: 20, block: 40, dodge: 40 },
    },
    2: {
      dodgeChance: 0.5,
      decisionInterval: 8,
      counterAttackChance: 0.8,
      aggressionMultiplier: 1.0,
      attackRangeMultiplier: 1.05,
      aggressiveHpThreshold: 0.6,
      cautiousHpThreshold: 0.3,
      highHpActionWeights: { attack: 65, block: 15, dodge: 20 },
      midHpActionWeights: { attack: 55, block: 22, dodge: 23 },
      lowHpActionWeights: { attack: 25, block: 35, dodge: 40 },
    },
    3: {
      dodgeChance: 0.7,
      decisionInterval: 5,
      counterAttackChance: 0.85,
      aggressionMultiplier: 1.2,
      attackRangeMultiplier: 1.1,
      aggressiveHpThreshold: 0.65,
      cautiousHpThreshold: 0.3,
      highHpActionWeights: { attack: 70, block: 10, dodge: 20 },
      midHpActionWeights: { attack: 60, block: 20, dodge: 20 },
      lowHpActionWeights: { attack: 30, block: 35, dodge: 35 },
    },
    4: {
      dodgeChance: 0.99,
      decisionInterval: 1,
      counterAttackChance: 0.95,
      aggressionMultiplier: 1.5,
      attackRangeMultiplier: 1.15,
      aggressiveHpThreshold: 0.7,
      cautiousHpThreshold: 0.35,
      highHpActionWeights: { attack: 75, block: 10, dodge: 15 },
      midHpActionWeights: { attack: 65, block: 17, dodge: 18 },
      lowHpActionWeights: { attack: 35, block: 30, dodge: 35 },
    },
  },
  safeDistance: 200,
  attackRange: 100,
  minCollisionDistance: 40,
  emergencyRetreatHpThreshold: 0.45,
  consecutiveDodgeLimit: 3,
  dodgeCooldownFrames: 25,
  counterAttackWindowStart: 2,
  counterAttackWindowEnd: 12,
  emergencyRetreatDistance: 250,
  emergencyRetreatSpeed: 15,
};

export const getDifficultyConfig = (difficulty: number): AIDifficultyConfig => {
  return aiConfig.difficulties[difficulty] || aiConfig.difficulties[2];
};
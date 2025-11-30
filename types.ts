export enum DiceType {
  D6 = 6,
  D21 = 21,
}

export interface RollResult {
  value: number;
  type: DiceType;
  timestamp: number;
}

export interface AiFortune {
  text: string;
  tone: 'lucky' | 'neutral' | 'ominous';
}
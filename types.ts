
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type GameState = 'AUTH' | 'MENU' | 'PLAYING' | 'GAMEOVER' | 'PROFILE' | 'PRIVACY';

export interface GameResult {
  score: number;
  difficulty: Difficulty;
  timestamp: number;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarColor: string;
  highScores: Record<Difficulty, number>;
  history: GameResult[];
  totalSolved: number;
}

export interface Equation {
  text: string;
  result: number;
  isCorrect: boolean;
  displayResult: number;
}

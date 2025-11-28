export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameMode = 'pass-through' | 'walls';

export interface Position {
  x: number;
  y: number;
}

export interface SnakeSegment extends Position {
  dotSide: 'left' | 'right';
}

export interface GameState {
  snake: SnakeSegment[];
  food: Position;
  direction: Direction;
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
  gameMode: GameMode;
  speed: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  score: number;
  gameMode: GameMode;
  date: string;
}

export interface ActivePlayer {
  id: string;
  username: string;
  gameState: GameState;
  startedAt: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface LeaderboardResponse {
  success: boolean;
  entries: LeaderboardEntry[];
  error?: string;
}

export interface ActivePlayersResponse {
  success: boolean;
  players: ActivePlayer[];
  error?: string;
}

export interface SubmitScoreResponse {
  success: boolean;
  entry?: LeaderboardEntry;
  error?: string;
}

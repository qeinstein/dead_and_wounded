export type GameMode = 'VS_COMPUTER' | 'TWO_PLAYER_SAME_DEVICE';
export type GameStatus = 'IN_PROGRESS' | 'WON' | 'PLAYER1_WON' | 'PLAYER2_WON';
export type Player = 'PLAYER_1' | 'PLAYER_2' | 'COMPUTER';

export interface GuessRecord {
  guess: string;
  dead: number;
  wounded: number;
  player: Player;
  timestamp: string;
}

export interface Game {
  id: string;
  mode: GameMode;
  status: GameStatus;
  currentTurn: Player;
  history: GuessRecord[];
  revealedSecretCode?: string;
  createdAt: string;
}

export interface GuessResult {
  guess: string;
  dead: number;
  wounded: number;
  gameOver: boolean;
  status: GameStatus;
  winner?: Player;
  nextTurn?: Player;
  history: GuessRecord[];
}

export interface CreateGamePayload {
  mode: GameMode;
  customSecretCode?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function createGame(payload: CreateGamePayload): Promise<Game> {
  const res = await fetch(`${API_BASE_URL}/api/v1/games`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create game session');
  }

  return res.json();
}

export async function getGame(id: string): Promise<Game> {
  const res = await fetch(`${API_BASE_URL}/api/v1/games/${id}`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch game state');
  }

  return res.json();
}

export async function submitGuess(id: string, guess: string): Promise<GuessResult> {
  const res = await fetch(`${API_BASE_URL}/api/v1/games/${id}/guess`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ guess }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Invalid guess');
  }

  return res.json();
}

import { GameState } from './game-state';

export interface InitializeBoard {
  board: GameState;
  threshold: number;
  seed: string;
}

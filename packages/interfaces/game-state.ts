import { Cell } from './Cell';

export interface GameState {
  // Unique identifier for each cell is concatenation of x and y coordinates
  [hash: string]: Cell;
}

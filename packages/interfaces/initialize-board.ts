import { Cell } from './Cell';

export interface InitializeBoard {
  board: Cell[];
  threshold: number;
  seed: string;
}

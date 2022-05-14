import SeedGenerator from 'seedrandom';
import { Cell, InitializeBoard, CellState } from 'interfaces';

/**
 * Randomize cell's state arrangement before starting the game
 * @param {InitializeBoard} boardInfo Current board state with given seed and threshold value
 * @returns {Cell[]} Array of cell with randomized states
 */
export const randomizeBoard = ({ board, seed, threshold }: InitializeBoard): Cell[] => {
  const rng = SeedGenerator(seed);
  const initializedCells = board.map((cell: Cell) => {
    const randomNumber = rng();
    if (randomNumber <= threshold) {
      cell.state = CellState.ALIVE;
    } else {
      cell.state = CellState.DEAD;
    }
    return cell;
  });
  return initializedCells;
};

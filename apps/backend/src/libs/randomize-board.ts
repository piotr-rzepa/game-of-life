import SeedGenerator from 'seedrandom';
import { InitializeBoard, CellState, GameState } from 'interfaces';

/**
 * Randomize cell's state arrangement before starting the game
 * @param {InitializeBoard} boardInfo Current board state with given seed and threshold value
 * @returns {GameState} Dictionary of cell with randomized states
 */
export const randomizeBoard = ({ board, seed, threshold }: InitializeBoard): GameState => {
  const rng = SeedGenerator(seed);
  const initializedBoard = Object.fromEntries(
    Object.entries(board).map(([hash, cell]) => {
      const randomNumber = rng();
      if (randomNumber <= threshold) {
        cell.state = CellState.ALIVE;
      } else {
        cell.state = CellState.DEAD;
      }
      return [hash, cell];
    })
  );
  return initializedBoard;
};

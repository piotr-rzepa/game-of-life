/* eslint-disable no-underscore-dangle */
import { Cell, CellState, GameState } from 'interfaces';
import md5 from 'md5';

/**
 * Evaluates number of neighbors of given cell that are dead or alive
 * @param neighbors Neighbors of given cell
 * @returns Object with information about number of dead/alive neighbors
 */
export const getNeighborsState = (neighbors: Cell[]) => {
  const result = {
    [CellState.ALIVE]: 0,
    [CellState.DEAD]: 0
  };
  // eslint-disable-next-line no-return-assign
  neighbors.forEach((cell: Cell) => (result[cell.state] += 1));
  return result;
};

/**
 * Gets all neighbors of given cell, that are horizontally, vertically or diagonally adjacent
 * @param cell Cell for which the neighbors should be received
 * @returns Collection of cells that are neighbors of cell provided as an argument
 */
export const getNeighbors = (cell: Cell, board: GameState): Cell[] => {
  const { gridXIndex: x, gridYIndex: y } = cell;

  const neighbors: Cell[] = [];

  // Thanks to converting GameState from collection to dictionary, lookup takes O(1) time
  neighbors.push(
    board[md5(`${x - 1}x${y}`)],
    board[md5(`${x + 1}x${y}`)],
    board[md5(`${x}x${y - 1}`)],
    board[md5(`${x}x${y + 1}`)],
    board[md5(`${x - 1}x${y - 1}`)],
    board[md5(`${x + 1}x${y - 1}`)],
    board[md5(`${x - 1}x${y + 1}`)],
    board[md5(`${x + 1}x${y + 1}`)]
  );

  // Filter possible undefined values emerged from edge cells
  return neighbors.filter((possibleCell: Cell): possibleCell is Cell => !!possibleCell);
};

/**
 * Updates states of the board according to the Game of Life rules.
 * @link https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
 * @param {GameState} currentState Current state of the cells on board
 * @returns {GameState} Updated state of the board
 */
export const createNextGeneration = (currentState: GameState): GameState => {
  /**
   * Rules:
   * Any live cell with two or three live neighbors survives
   * Any dead cell with three live neighbors becomes a live cell
   * All other live cells die in the next generation. Similarly, all other dead cells stay dead
   */

  const nextGeneration: GameState = Object.fromEntries(
    Object.entries(currentState).map(([hash, cell]) => {
      const neighbors = getNeighbors(cell, currentState);
      const neighborsState = getNeighborsState(neighbors);

      if (
        (neighborsState[CellState.ALIVE] === 2 || neighborsState[CellState.ALIVE] === 3) &&
        cell.state === CellState.ALIVE
      ) {
        return [hash, new Cell(cell.x, cell.y, cell.gridXIndex, cell.gridYIndex, CellState.ALIVE)];
      }
      if (neighborsState[CellState.ALIVE] === 3 && cell.state === CellState.DEAD) {
        return [hash, new Cell(cell.x, cell.y, cell.gridXIndex, cell.gridYIndex, CellState.ALIVE)];
      }
      return [hash, new Cell(cell.x, cell.y, cell.gridXIndex, cell.gridYIndex, CellState.DEAD)];
    })
  );
  return nextGeneration;
};

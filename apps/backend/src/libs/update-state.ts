/* eslint-disable no-underscore-dangle */
import { Cell, CellState } from 'interfaces';

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
  neighbors.forEach((cell) => (result[cell.state] += 1));
  return result;
};

/**
 * Gets all neighbors of given cell, that are horizontally, vertically or diagonally adjacent
 * @param cell Cell for which the neighbors should be received
 * @returns Collection of cells that are neighbors of cell provided as an argument
 */
export const getNeighbors = (cell: Cell, board: Cell[]) => {
  // TODO: Optimize to not search whole board for each cell
  const { gridXIndex: x, gridYIndex: y } = cell;
  const neighbors = board.filter(
    ({ gridXIndex, gridYIndex }) =>
      (gridXIndex === x - 1 && gridYIndex === y) ||
      (gridXIndex === x + 1 && gridYIndex === y) ||
      (gridXIndex === x && gridYIndex === y - 1) ||
      (gridXIndex === x && gridYIndex === y + 1) ||
      (gridXIndex === x - 1 && gridYIndex === y - 1) ||
      (gridXIndex === x + 1 && gridYIndex === y - 1) ||
      (gridXIndex === x - 1 && gridYIndex === y + 1) ||
      (gridXIndex === x + 1 && gridYIndex === y + 1)
  );
  return neighbors;
};

/**
 * Updates states of the board according to the Game of Life rules.
 * @link https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
 * @param currentState Current state of the cells on board
 * @returns Updated state of the board
 */
export const createNextGeneration = (currentState: Cell[]) => {
  /**
   * Rules:
   * Any live cell with two or three live neighbors survives
   * Any dead cell with three live neighbors becomes a live cell
   * All other live cells die in the next generation. Similarly, all other dead cells stay dead
   */
  const nextGeneration: Cell[] = [];

  currentState.forEach((cell) => {
    const neighbors = getNeighbors(cell, currentState);
    const neighborsState = getNeighborsState(neighbors);

    if (
      (neighborsState[CellState.ALIVE] === 2 || neighborsState[CellState.ALIVE] === 3) &&
      cell.state === CellState.ALIVE
    ) {
      nextGeneration.push(new Cell(cell.x, cell.y, cell.gridXIndex, cell.gridYIndex, CellState.ALIVE));
    } else if (neighborsState[CellState.ALIVE] === 3 && cell.state === CellState.DEAD) {
      nextGeneration.push(new Cell(cell.x, cell.y, cell.gridXIndex, cell.gridYIndex, CellState.ALIVE));
    } else {
      nextGeneration.push(new Cell(cell.x, cell.y, cell.gridXIndex, cell.gridYIndex, CellState.DEAD));
    }
  });
  return nextGeneration;
};

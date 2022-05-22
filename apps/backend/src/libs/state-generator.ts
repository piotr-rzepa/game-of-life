import { GameState } from 'interfaces';
import { loggers } from 'winston';
import { LoggerLabel } from 'logger';
import { createNextGeneration } from './update-state';

const logger = loggers.get(LoggerLabel.BACKEND);

/**
 * Generates next state of the cell's board
 * @param initialState Initial random state of the board
 * @yields next state of the board using data from previous state
 */
export const stateGenerator = function* (initialState: GameState) {
  let state = initialState;
  while (true) {
    const start = process.hrtime();
    const newState = createNextGeneration(state);
    const [seconds, nanoseconds] = process.hrtime(start);
    logger.info(`Execution time of createNextGeneration(): ${seconds}s, ${nanoseconds / 1_000_000}ms`);

    state = newState;
    yield newState;
  }
};

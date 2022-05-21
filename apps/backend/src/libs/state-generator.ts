import { Cell } from 'interfaces';
import { createNextGeneration } from './update-state';

export const stateGenerator = function* (initialState: Cell[]) {
  let state = initialState;
  while (true) {
    const newState = createNextGeneration(state);
    state = newState;
    yield newState;
  }
};

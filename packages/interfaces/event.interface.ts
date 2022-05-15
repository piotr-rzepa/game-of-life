import { EventType } from './event-type.enum';
export interface GameEvent<T = any> {
  type: EventType;
  payload: T;
}

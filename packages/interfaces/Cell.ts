import { CellState } from './cell-state.enum';

export class Cell {
  public static size: number;

  public static context: CanvasRenderingContext2D;

  constructor(private _x: number, private _y: number, private _state: CellState) {}

  public draw(): void {
    if (this._state === CellState.DEAD) {
      Cell.context.fillStyle = '#FFFFFF';
      Cell.context.fillRect(this._x, this._y, Cell.size, Cell.size);
    } else {
      Cell.context.fillStyle = '#282c34';
      Cell.context.fillRect(this._x, this._y, Cell.size, Cell.size);
    }
  }

  public switchState(): void {
    this._state = this._state === CellState.DEAD ? CellState.ALIVE : CellState.DEAD;
  }

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public get position(): { x: number; y: number } {
    return { x: this._x, y: this._y };
  }

  public get state(): CellState {
    return this._state;
  }

  public set state(newState: CellState) {
    this._state = newState;
  }
}

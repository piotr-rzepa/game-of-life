import { CellState } from './cell-state.enum';

export class Cell {
  public static size: number;

  public static context: CanvasRenderingContext2D;

  constructor(
    public x: number,
    public y: number,
    public gridXIndex: number,
    public gridYIndex: number,
    public state: CellState
  ) {}

  public draw(): void {
    if (this.state === CellState.DEAD) {
      Cell.context.fillStyle = '#FFFFFF';
      Cell.context.fillRect(this.x, this.y, Cell.size, Cell.size);
    } else {
      Cell.context.fillStyle = '#282c34';
      Cell.context.fillRect(this.x, this.y, Cell.size, Cell.size);
    }
  }

  public switchState(): void {
    this.state = this.state === CellState.DEAD ? CellState.ALIVE : CellState.DEAD;
  }

  static fromJSON({
    x,
    y,
    gridXIndex,
    gridYIndex,
    state
  }: {
    x: number;
    y: number;
    gridXIndex: number;
    gridYIndex: number;
    state: CellState;
  }) {
    return new Cell(x, y, gridXIndex, gridYIndex, state);
  }
}

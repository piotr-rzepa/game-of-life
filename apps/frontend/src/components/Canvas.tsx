import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import Websocket from '../Websocket';

interface Props {
  width: string;
  height: string;
  cellSize: number;
  cellFillStyle: string | CanvasGradient | CanvasPattern;
}

class Cell {
  public x: number;

  public y: number;

  public static size: number;

  public static context: CanvasRenderingContext2D;

  public status: 'dead' | 'alive';

  constructor(x: number, y: number, status: 'dead' | 'alive') {
    this.x = x;
    this.y = y;
    this.status = status;
  }

  public draw() {
    if (this.status === 'dead') {
      Cell.context.fillStyle = '#FFFFFF';
      Cell.context.fillRect(this.x, this.y, Cell.size, Cell.size);
    } else {
      Cell.context.fillStyle = '#282c34';
      Cell.context.fillRect(this.x, this.y, Cell.size, Cell.size);
    }
  }

  public changeState() {
    this.status = this.status === 'dead' ? 'alive' : 'dead';
  }
}

const Canvas: React.FC<Props> = ({ width, height, cellSize, cellFillStyle }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null) as MutableRefObject<HTMLCanvasElement>;
  const [gameState, setGameState] = useState<Cell[]>([]);
  const [gameStatus, setGameStatus] = useState<boolean>(false);

  const initializeBoard = (context: CanvasRenderingContext2D) => {
    // Subtract two to take into account the the paddings
    const squaresToFitWidth = Math.floor(Number(width) / cellSize) - 2;
    const squaresToFitHeight = Math.floor(Number(height) / cellSize) - 2;
    const totalPaddingX = Number(width) - squaresToFitWidth * cellSize;
    const totalPaddingY = Number(height) - squaresToFitHeight * cellSize;
    const paddingLeft = Math.ceil(totalPaddingX / 2) - 0.5;
    const paddingTop = Math.ceil(totalPaddingY / 2) - 0.5;
    const paddingRight = Number(width) - squaresToFitWidth * cellSize - paddingLeft;
    const paddingBottom = Number(height) - squaresToFitHeight * cellSize - paddingTop;

    Cell.size = cellSize;
    Cell.context = context;

    const cellArray: Cell[] = [];

    for (let x = paddingLeft; x < Number(width) - paddingRight; x += cellSize) {
      for (let y = paddingTop; y < Number(height) - paddingBottom; y += cellSize) {
        cellArray.push(new Cell(x, y, 'dead'));
      }
    }
    setGameState(() => [...cellArray]);
  };

  const drawCells = () => {
    gameState.forEach((cell: Cell) => cell.draw());
  };

  const drawGrid = (context: CanvasRenderingContext2D) => {
    // Subtract two to take into account the the paddings
    const squaresToFitWidth = Math.floor(Number(width) / cellSize) - 2;
    const squaresToFitHeight = Math.floor(Number(height) / cellSize) - 2;
    const totalPaddingX = Number(width) - squaresToFitWidth * cellSize;
    const totalPaddingY = Number(height) - squaresToFitHeight * cellSize;
    const paddingLeft = Math.ceil(totalPaddingX / 2) - 0.5;
    const paddingTop = Math.ceil(totalPaddingY / 2) - 0.5;
    const paddingRight = Number(width) - squaresToFitWidth * cellSize - paddingLeft;
    const paddingBottom = Number(height) - squaresToFitHeight * cellSize - paddingTop;
    context.strokeStyle = '#000000';
    context.fillStyle = cellFillStyle;
    context.beginPath();

    for (let x = paddingLeft; x <= Number(width) - paddingRight; x += cellSize) {
      context.moveTo(x, paddingTop);
      context.lineTo(x, Number(height) - paddingBottom);
    }

    for (let y = paddingTop; y <= Number(height) - paddingBottom; y += cellSize) {
      context.moveTo(paddingLeft, y);
      context.lineTo(Number(width) - paddingRight, y);
    }
    context.stroke();
  };

  const printState = () => {
    gameState[Math.floor(Math.random() * gameState.length)].changeState();
    setGameState(() => [...gameState]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d')!;
    initializeBoard(context);
  }, []);

  useEffect(() => {
    console.log('Game state changed!');
    drawGrid(canvasRef.current.getContext('2d')!);
    drawCells();
  }, [gameState]);

  const websocket = new Websocket('http://localhost:3001');

  return (
    <>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="Canvas-grid"
      />
      <Button
        type="default"
        onClick={() => {
          setGameStatus(() => true);
          setInterval(() => printState(), 100);
        }}
        ghost={true}
        shape="round"
        disabled={gameStatus}
      >
        Start game
      </Button>
      <Button
        type="default"
        onClick={() => websocket.sendEvent({ type: 'elo', payload: { message: 'elo' } })}
        ghost={true}
        shape="round"
        disabled={gameStatus}
      >
        Connect
      </Button>
    </>
  );
};

export default Canvas;

import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { EventType, InitializeBoard, CellState } from 'interfaces';
import { Cell, computeGridDimensions } from '../libs';
import { useWebsocketContext } from '../context';

interface Props {
  width: string;
  height: string;
  cellSize: number;
  cellFillStyle: string | CanvasGradient | CanvasPattern;
}

const Canvas: React.FC<Props> = ({ width, height, cellSize, cellFillStyle }): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null) as MutableRefObject<HTMLCanvasElement>;
  const websocket = useWebsocketContext();
  const [gameState, setGameState] = useState<Cell[]>([]);
  const [gameStatus, setGameStatus] = useState<boolean>(false);
  const [timer, setTimer] = useState<NodeJS.Timer | undefined>(undefined);

  const initializeBoard = (context: CanvasRenderingContext2D) => {
    const { paddingLeft, paddingRight, paddingTop, paddingBottom } = computeGridDimensions(width, height, cellSize);
    Cell.size = cellSize;
    Cell.context = context;

    const cellArray: Cell[] = [];

    for (let x = paddingLeft; x < Number(width) - paddingRight; x += cellSize) {
      for (let y = paddingTop; y < Number(height) - paddingBottom; y += cellSize) {
        cellArray.push(new Cell(x, y, CellState.DEAD));
      }
    }
    setGameState(() => [...cellArray]);
  };

  const drawCells = (): void => {
    gameState.forEach((cell: Cell) => cell.draw());
  };

  const drawGrid = (context: CanvasRenderingContext2D) => {
    const { paddingLeft, paddingRight, paddingTop, paddingBottom } = computeGridDimensions(width, height, cellSize);
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

  const randomEpoch = (): void => {
    gameState[Math.floor(Math.random() * gameState.length)].switchState();
    setGameState(() => [...gameState]);
  };

  useEffect((): void => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d')!;
    initializeBoard(context);
    websocket.addListener(EventType.INITIALIZE_BOARD, (payload: { _x: number; _y: number; state: CellState }[]) => {
      // eslint-disable-next-line no-underscore-dangle
      const newBoard = Array.from(payload, (cell) => new Cell(cell._x, cell._y, cell.state));
      setGameState(() => [...newBoard]);
    });
  }, []);

  useEffect((): void => {
    drawGrid(canvasRef.current.getContext('2d')!);
    drawCells();
  }, [gameState]);

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
          setTimer(setInterval(() => randomEpoch(), 1000));
        }}
        ghost={true}
        shape="round"
        disabled={gameStatus}
      >
        Start game
      </Button>
      <Button
        type="default"
        onClick={() =>
          websocket.sendEvent<InitializeBoard>({
            type: EventType.INITIALIZE_BOARD,
            payload: { board: gameState, seed: new Date().getTime().toString(), threshold: 0.5 }
          })
        }
        ghost={true}
        shape="round"
        disabled={gameStatus}
      >
        Initialize board
      </Button>
      <Button
        type="default"
        onClick={() => {
          if (typeof timer !== 'undefined') {
            clearInterval(timer);
            setTimer(() => undefined);
            setGameStatus(() => false);
          }
        }}
        ghost={true}
        shape="round"
        disabled={!gameStatus}
      >
        Stop game
      </Button>
    </>
  );
};

export default Canvas;

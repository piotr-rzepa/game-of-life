/* eslint-disable no-underscore-dangle */
import '../App.css';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Button, Slider } from 'antd';
import { EventType, InitializeBoard, CellState, GameState } from 'interfaces';
import md5 from 'md5';
import { Cell, computeGridDimensions } from '../libs';
import { useWebsocketContext } from '../context';

interface Props {
  width: string;
  height: string;
  cellSize: number;
  cellFillStyle: string | CanvasGradient | CanvasPattern;
}

enum GameStatus {
  STOPPED,
  INITIALIZED,
  NOT_INITIALIZED,
  STARTED
}

const Canvas: React.FC<Props> = ({ width, height, cellSize, cellFillStyle }): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null) as MutableRefObject<HTMLCanvasElement>;
  const websocket = useWebsocketContext();
  const [gameState, setGameState] = useState<GameState>({});
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.NOT_INITIALIZED);
  const [timer, setTimer] = useState<NodeJS.Timer | undefined>(undefined);
  const [epoch, setEpoch] = useState<number>(0);
  const [gameSpeed, setGameSpeed] = useState<number>(1000);
  const [currentCellSize, setCurrentCellSize] = useState<number>(cellSize);

  const initializeBoard = (context: CanvasRenderingContext2D) => {
    const { paddingLeft, paddingRight, paddingTop, paddingBottom } = computeGridDimensions(
      width,
      height,
      currentCellSize
    );
    Cell.size = currentCellSize;
    Cell.context = context;

    const cellDictionary: GameState = {};

    for (let y = paddingTop, squaresY = 0; y < Number(height) - paddingBottom; y += currentCellSize, squaresY += 1) {
      for (let x = paddingLeft, squaresX = 0; x < Number(width) - paddingRight; x += currentCellSize, squaresX += 1) {
        const hash = md5(`${squaresX}x${squaresY}`);
        cellDictionary[hash] = new Cell(x, y, squaresX, squaresY, CellState.DEAD);
      }
    }
    setGameState(() => cellDictionary);
  };

  const drawCells = (): void => {
    Object.values(gameState).forEach((cell: Cell) => cell.draw());
  };

  const drawGrid = (context: CanvasRenderingContext2D) => {
    const { paddingLeft, paddingRight, paddingTop, paddingBottom } = computeGridDimensions(
      width,
      height,
      currentCellSize
    );
    context.strokeStyle = '#000000';
    context.fillStyle = cellFillStyle;
    context.beginPath();

    for (let x = paddingLeft; x <= Number(width) - paddingRight; x += currentCellSize) {
      context.moveTo(x, paddingTop);
      context.lineTo(x, Number(height) - paddingBottom);
    }

    for (let y = paddingTop; y <= Number(height) - paddingBottom; y += currentCellSize) {
      context.moveTo(paddingLeft, y);
      context.lineTo(Number(width) - paddingRight, y);
    }
    context.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d')!;
    initializeBoard(context);
    setEpoch(() => 0);
    setGameStatus(() => GameStatus.NOT_INITIALIZED);
    return () => context.clearRect(0, 0, canvas.width, canvas.height);
  }, [currentCellSize]);

  useEffect((): void => {
    websocket.addListener(EventType.INITIALIZE_BOARD, (payload: GameState) => {
      const newBoard: GameState = Object.fromEntries(
        Object.entries(payload).map(([hash, cell]) => [hash, Cell.fromJSON(cell)])
      );
      setGameState(() => newBoard);
    });
    // TODO: Refactor to use same logic by two listeners
    websocket.addListener(EventType.GENERATION, (payload: Cell[]) => {
      const newBoard: GameState = Object.fromEntries(
        Object.entries(payload).map(([hash, cell]) => [hash, Cell.fromJSON(cell)])
      );
      setGameState(() => newBoard);
      setEpoch((currentEpoch) => currentEpoch + 1);
    });
  }, []);

  useEffect((): void => {
    drawGrid(canvasRef.current.getContext('2d')!);
    drawCells();
  }, [gameState]);

  return (
    <>
      <p>Game Speed: {gameSpeed}ms</p>
      <Slider
        defaultValue={1000}
        min={100}
        max={3000}
        step={100}
        onChange={(value) => setGameSpeed(() => value)}
        disabled={gameStatus === GameStatus.STARTED}
      />
      <p>
        Grid size: {Math.floor(Number(width) / currentCellSize - 2)}x{Math.floor(Number(height) / currentCellSize - 2)}
      </p>
      <Slider
        defaultValue={100}
        min={4}
        max={100}
        step={2}
        onChange={(value) => setCurrentCellSize(() => value)}
        disabled={gameStatus === GameStatus.STARTED}
      />
      <p>Epoch: {epoch}</p>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="Canvas-grid"
      />
      <Button
        type="default"
        onClick={() => {
          setGameStatus(() => GameStatus.STARTED);
          setTimer(
            setInterval(
              () => websocket.sendEvent<GameState>({ type: EventType.GENERATION, payload: gameState }),
              gameSpeed
            )
          );
        }}
        ghost={true}
        shape="round"
        disabled={gameStatus === GameStatus.NOT_INITIALIZED || gameStatus === GameStatus.STARTED}
      >
        Start game
      </Button>
      <Button
        type="default"
        onClick={() => {
          websocket.sendEvent<InitializeBoard>({
            type: EventType.INITIALIZE_BOARD,
            payload: { board: gameState, seed: new Date().getTime().toString(), threshold: 0.5 }
          });
          setGameStatus(() => GameStatus.INITIALIZED);
          setEpoch(() => 0);
        }}
        ghost={true}
        shape="round"
        disabled={gameStatus === GameStatus.STARTED}
      >
        Initialize board
      </Button>
      <Button
        type="default"
        onClick={() => {
          if (typeof timer !== 'undefined') {
            clearInterval(timer);
            setTimer(() => undefined);
            setGameStatus(() => GameStatus.STOPPED);
          }
        }}
        ghost={true}
        shape="round"
        disabled={gameStatus !== GameStatus.STARTED}
      >
        Stop game
      </Button>
    </>
  );
};

export default Canvas;

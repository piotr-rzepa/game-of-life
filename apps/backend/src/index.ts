import 'dotenv/config';
import express, { Express } from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { loggers } from 'winston';
import { LoggerLabel } from 'logger';
import { EventType, InitializeBoard } from 'interfaces';
import { randomizeBoard } from './libs';

const app: Express = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
const { HOST, PORT } = process.env;
const logger = loggers.get(LoggerLabel.BACKEND);

io.on('connection', (socket) => {
  socket.on(EventType.INITIALIZE_BOARD, (payload: InitializeBoard) =>
    socket.emit(EventType.INITIALIZE_BOARD, randomizeBoard(payload))
  );
});

server.listen(PORT, () =>
  logger.info(`⚡ Websocket Server is running at http://${HOST}:${PORT}. Alternative url: ws://${HOST}:${PORT}`)
);

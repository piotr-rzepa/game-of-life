import 'dotenv/config';
import express, { Express } from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { loggers } from 'winston';

import { LoggerLabel } from 'logger';

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

io.on('connection', () => logger.info('A user connected!'));

server.listen(PORT, () =>
  logger.info(`⚡ Websocket Server is running at http://${HOST}:${PORT}. Alternative url: ws://${HOST}:${PORT}`)
);

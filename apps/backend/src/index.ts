import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import { loggers } from 'winston';
import { LoggerLabel } from 'logger';

const app: Express = express();
const { HOST, PORT } = process.env;
const logger = loggers.get(LoggerLabel.BACKEND);

app.get('/', (req: Request, res: Response) => res.send({ message: 'Hello World' }));

app.listen(PORT, () => logger.info(`⚡ Server is running at http://${HOST}:${PORT}`));

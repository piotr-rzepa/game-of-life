import { transports, format, loggers } from 'winston';
import { LoggerLabel } from './logger-labels.enum';

const { combine, timestamp, label, prettyPrint, printf } = format;
const { HOST, PORT } = process.env;

const winstonCustomFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

loggers.add(LoggerLabel.BACKEND, {
  level: 'info',
  format: combine(label({ label: LoggerLabel.BACKEND }), timestamp(), prettyPrint(), winstonCustomFormat),
  transports: [new transports.Console(), new transports.Http({ host: HOST, port: Number(PORT) })]
});

import winston from 'winston';

const logger = winston.createLogger({
  exitOnError: false,
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export default logger;

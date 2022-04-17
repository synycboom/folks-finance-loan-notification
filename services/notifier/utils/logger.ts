import winston from 'winston';
import { logLevel } from 'kafkajs';

const toWinstonLogLevel = (level: logLevel) => {
  switch(level) {
    case logLevel.ERROR:
    case logLevel.NOTHING:
        return 'error';
    case logLevel.WARN:
        return 'warn';
    case logLevel.INFO:
        return 'info';
    case logLevel.DEBUG:
        return 'debug';
  }
}

const logger = winston.createLogger({
  exitOnError: false,
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export const WinstonLogCreator = (level: logLevel) => {
  const logger = winston.createLogger({
    exitOnError: false,
    level: toWinstonLogLevel(level),
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
  });

  return ({ level, log }: { level: logLevel, log: any }) => {
      const { message, ...extra } = log;

      logger.log({
          level: toWinstonLogLevel(level),
          message,
          extra,
      });
  };
};

export default logger;

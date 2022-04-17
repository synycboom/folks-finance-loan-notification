
import * as dotenv from 'dotenv';

dotenv.config();

import { Kafka, logLevel } from 'kafkajs';
import { requireEnv } from './utils/env';
import logger, { WinstonLogCreator } from './utils/logger';

const kafkaTopic = requireEnv('KAFKA_TOPIC');
const kafkaBroker = requireEnv('KAFKA_BROKER');
const kafka = new Kafka({
  clientId: 'loan-notification-monitor',
  brokers: [kafkaBroker],
  connectionTimeout: 20000, // 20 seconds
  logLevel: logLevel.INFO,
  logCreator: WinstonLogCreator
});
const producer = kafka.producer({
  idempotent: false,
});

async function start() {
  logger.info('producer is connecting to kafka broker(s)');

  await producer.connect();

  logger.info('producer is running');
}

start().catch((err) => {
  console.error(err.message, { stack: err.stack });
  process.exit(1);
}).finally(async () => {
  await producer.disconnect();
});

const errorTypes = ['unhandledRejection', 'uncaughtException'];
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

errorTypes.forEach(type => {
  process.on(type, async err => {
    try {
      logger.error(`process.on ${type}`)
      logger.error(err.message, { stack: err.stack });

      await producer.disconnect();

      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});

signalTraps.forEach(type => {
  process.once(type, async () => {
    try {
      await producer.disconnect();
    } finally {
      process.kill(process.pid, type);
    }
  })
});

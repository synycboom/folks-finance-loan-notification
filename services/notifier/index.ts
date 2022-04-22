
import * as dotenv from 'dotenv';

dotenv.config();

import express, { Application } from "express";
import { Kafka, logLevel } from 'kafkajs';
import { requireEnv } from './utils/env';
import logger, { WinstonLogCreator } from './utils/logger';
import { notify } from './services/notifier';

const kafkaTopic = requireEnv('KAFKA_TOPIC');
const kafkaConsumerGroup = requireEnv('KAFKA_CONSUMER_GROUP');
const kafkaBroker = requireEnv('KAFKA_BROKER');
const kafka = new Kafka({
  clientId: 'loan-notification-notifier',
  brokers: [kafkaBroker],
  connectionTimeout: 20000, // 20 seconds
  logLevel: logLevel.INFO,
  logCreator: WinstonLogCreator
});
const consumer = kafka.consumer({
  groupId: kafkaConsumerGroup,
});

const app: Application = express();
const port = process.env.PORT || 8081;

async function start() {
  logger.info('consumer is connecting to kafka broker(s)');

  await consumer.connect();
  await consumer.subscribe({
    topic: kafkaTopic,
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const { publicAddress, message: sendingMessage, sendTo } = JSON.parse(message.value?.toString() || '{}');
      const userAddress = publicAddress.trim();

      logger.info('incoming payload', { userAddress, sendingMessage, sendTo });

      if (!userAddress) {
        return;
      }
      if (!sendingMessage) {
        return;
      }
      if (!(sendTo instanceof Array)) {
        return;
      }

      notify(userAddress, sendingMessage, sendTo).catch((err) => {
        logger.error(err.message, { stack: err.stack });
      });
    },
  });

  logger.info('consumer is running');

  app.get('/health', (_, res) => {
    res.send('ok');
  });
  app.listen(port, (): void => {
    logger.info(`running server on port ${port}`);
  });
}

start().catch(async (err) => {
  logger.error(err.message, { stack: err.stack });

  await consumer.disconnect();

  process.exit(1);
})

const errorTypes = ['unhandledRejection', 'uncaughtException'];
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

errorTypes.forEach(type => {
  process.on(type, async err => {
    try {
      logger.error(`process.on ${type}`)
      logger.error(err.message, { stack: err.stack });

      await consumer.disconnect();

      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});

signalTraps.forEach(type => {
  process.once(type, async () => {
    try {
      logger.warn(`process.once ${type}`)

      await consumer.disconnect();
    } finally {
      process.kill(process.pid, type);
    }
  })
});

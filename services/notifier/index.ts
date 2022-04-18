
import * as dotenv from 'dotenv';

dotenv.config();

import express, { Application } from "express";
import { Kafka, logLevel } from 'kafkajs';
import { requireEnv } from './utils/env';
import logger, { WinstonLogCreator } from './utils/logger';

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
const port = process.env.PORT || 8080;

async function start() {
  logger.info('consumer is connecting to kafka broker(s)');

  await consumer.connect();
  await consumer.subscribe({
    topic: kafkaTopic,
    fromBeginning: true,
  });


  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        value: message.value?.toString(),
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

start().catch((err) => {
  console.error(err.message, { stack: err.stack });
  process.exit(1);
}).finally(async () => {
  await consumer.disconnect();
});

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

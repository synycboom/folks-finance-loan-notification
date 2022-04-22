import {
  TestnetTokenPairs,
  getLoanInfo,
  TestnetOracle,
  TestnetTokenPairKey,
} from "folks-finance-js-sdk";
import { Producer } from "kafkajs";
import { Indexer } from "algosdk";
import { getNotifications, NotificationSetting } from "../models/notification";
import { requireEnv } from "./env";
import logger from "./logger";

const indexerClient = new Indexer("", requireEnv("INDEXER_CLIENT"), 443);

export const startMonitorLoans = async (producer: Producer, topic: string) => {
  while (true) {
    await checkLoanHealthFactor(producer, topic);
    await sleep(2000);
  }
};

const sendMessage = async (
  producer: Producer,
  topic: string,
  publicAddress: string,
  message: string,
  sendTo: string[]
) => {
  if (sendTo.length === 0) return;
  await producer.connect();
  await producer.send({
    topic,
    messages: [
      {
        key: publicAddress,
        value: JSON.stringify({
          publicAddress,
          message,
          sendTo,
        }),
      },
    ],
  });
};

const checkLoanHealthFactor = async (producer: Producer, topic: string) => {
  const notifications = await getNotifications();
  for (const notification of notifications) {
    const {
      escrowAddress,
      tokenPair,
      targetHealthFactor,
      hasNotified,
      userAddress,
    } = notification;
    const { healthFactor } = await getLoan(tokenPair, escrowAddress);
    const currentHealthFactor = convertBigIntToNumber(healthFactor, 14);

    notification.currentHealthFactor = currentHealthFactor;

    if (targetHealthFactor >= currentHealthFactor && !hasNotified) {
      await sendMessage(
        producer,
        topic,
        userAddress,
        `Warning!!!\nYour health factor is ${currentHealthFactor}`,
        getSendTo(notification)
      );
      notification.hasNotified = true;
      logger.info("trigger send message");
    } else if (targetHealthFactor < currentHealthFactor && hasNotified) {
      notification.hasNotified = false;
      logger.info("update hasNotified = false");
    }
    notification.save();
  }
};

const getSendTo = (notification: NotificationSetting) => {
  const { notifyDiscord, notifyTelegram } = notification;
  let sendTo = [];
  if (notifyDiscord) sendTo.push("discord");
  if (notifyTelegram) sendTo.push("telegram");
  return sendTo;
};

const getLoan = async (pairKey: TestnetTokenPairKey, escrowAddress: string) => {
  const tokenPair = TestnetTokenPairs[pairKey];

  return getLoanInfo(indexerClient, tokenPair, TestnetOracle, escrowAddress);
};

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const convertBigIntToNumber = (value: bigint, decimals: number) => {
  return Number(value) / 10 ** decimals;
};

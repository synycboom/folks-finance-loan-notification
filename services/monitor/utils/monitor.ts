import {
  TestnetTokenPairs,
  getLoanInfo,
  TestnetOracle,
  TestnetTokenPairKey,
  TestnetPoolKey,
} from "folks-finance-js-sdk";
import { Producer } from "kafkajs";
import { Indexer } from "algosdk";
import { getNotifications, NotificationSetting } from "../models/notification";
import { requireEnv } from "./env";

const indexerClient = new Indexer("", requireEnv("INDEXER_CLIENT"), 443);

export const startMonitorLoans = async (producer: Producer, topic: string) => {
  while (true) {
    // await checkLoanHealthFactor();
    await sleep(2000);
    // ...do some async work...

    // send message here
    await sendMessage(producer, topic, '<publicAddress>', 'hello', ['telegram', 'discord']);
  }
};

const sendMessage = async (
  producer: Producer,
  topic: string,
  publicAddress: string,
  message: string,
  sendTo: string[],
) => {
  await producer.connect();
  await producer.send({
    topic,
    messages: [{
      key: publicAddress,
      value: JSON.stringify({
        publicAddress,
        message,
        sendTo,
      }),
    }]
  });
}

const checkLoanHealthFactor = async () => {
  const notifications = await getNotifications();
  for (const notification of notifications) {
    const { escrowAddress, tokenPair, targetHealthFactor } = notification;
    // const { healthFactor } = await getLoan(tokenPair, escrowAddress);
    // const currentHealthFactor = convertBigIntToNumber(healthFactor, 14);
    // console.log(targetHealthFactor, currentHealthFactor);
  }
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

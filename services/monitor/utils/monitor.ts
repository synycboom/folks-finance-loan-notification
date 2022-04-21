// import {
//   TestnetTokenPairs,
//   getLoanInfo,
//   TestnetOracle,
//   TestnetTokenPairKey,
//   TestnetPoolKey,
// } from "folks-finance-js-sdk/src";
import { Indexer } from "algosdk";
import { getNotifications, NotificationSetting } from "../models/notification";
import { requireEnv } from "./env";

const indexerClient = new Indexer("", requireEnv("INDEXER_CLIENT"), 443);

export const startMonitorLoans = async () => {
  while (true) {
    // await checkLoanHealthFactor();
    await sleep(2000);
    // ...do some async work...
  }
};

// const checkLoanHealthFactor = async () => {
//   const notifications = await getNotifications();
//   for (const notification of notifications) {
//     const { escrowAddress, tokenPair, targetHealthFactor } = notification;
//     // const { healthFactor } = await getLoan(tokenPair, escrowAddress);
//     // const currentHealthFactor = convertBigIntToNumber(healthFactor, 14);
//     // console.log(targetHealthFactor, currentHealthFactor);
//   }
// };

// const getLoan = async (pairKey: TestnetTokenPairKey, escrowAddress: string) => {
//   const tokenPair = TestnetTokenPairs[pairKey];

//   return getLoanInfo(indexerClient, tokenPair, TestnetOracle, escrowAddress);
// };

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const convertBigIntToNumber = (value: bigint, decimals: number) => {
  return Number(value) / 10 ** decimals;
};

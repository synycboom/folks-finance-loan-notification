import {
  TestnetTokenPairs,
  getLoanInfo,
  TestnetOracle,
  TestnetTokenPairKey,
  TestnetPoolKey,
} from "folks-finance-js-sdk";
import { indexerClient } from ".";

export const convertBigIntToNumber = (value: bigint, decimals: number) => {
  return Number(value) / 10 ** decimals;
};

export const getLoans = async (address: string) => {
  let loans = [];

  for (const pair in TestnetTokenPairs) {
    const pairKey = pair as TestnetTokenPairKey;
    const tokenPair = TestnetTokenPairs[pairKey];
    const { appId, collateralPool, borrowPool } = tokenPair;
    const escrowAddress = await getLoanEscrowAddress(address, appId as number);

    if (escrowAddress) {
      const { borrowBalance, healthFactor, collateralBalance, userAddress } =
        await getLoanInfo(
          indexerClient,
          tokenPair,
          TestnetOracle,
          escrowAddress
        );
      const [borrowToken, collateralToken] = pairKey.split("-");
      loans.push({
        borrowBalance: convertBigIntToNumber(
          borrowBalance,
          borrowPool.assetDecimals
        ),
        collateralBalance: convertBigIntToNumber(
          collateralBalance,
          collateralPool.assetDecimals
        ),
        healthFactor: convertBigIntToNumber(healthFactor, 14),
        escrowAddress: escrowAddress,
        borrowToken: borrowToken as TestnetPoolKey,
        tokenPair: pairKey,
        userAddress,
        collateralToken: collateralToken as TestnetPoolKey,
      });
    }
  }

  return loans;
};

const getLoanEscrowAddress = async (
  userAddress: string,
  tokenPairAppId: number
): Promise<string | undefined> => {
  let txns: Record<string, any>;
  let noOfTxns: number;
  let lastTxn;

  // first call
  txns = await indexerClient
    .searchForTransactions()
    .address(userAddress)
    .applicationID(tokenPairAppId)
    .do();
  noOfTxns = txns.transactions.length;
  if (noOfTxns > 0) lastTxn = txns.transactions[noOfTxns - 1];

  // loop until we have the last txn
  while (noOfTxns === 1000) {
    const nextToken = txns["next-token"];
    txns = await indexerClient
      .searchForTransactions()
      .address(userAddress)
      .applicationID(tokenPairAppId)
      .nextToken(nextToken)
      .do();
    noOfTxns = txns.transactions.length;
    if (noOfTxns > 0) lastTxn = txns.transactions[noOfTxns - 1];
  }

  if (
    lastTxn &&
    lastTxn["application-transaction"]["application-args"][0] ===
      Buffer.from("ae").toString("base64")
  ) {
    return lastTxn["application-transaction"].accounts[0];
  }
};

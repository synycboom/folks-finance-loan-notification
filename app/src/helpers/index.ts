import MyAlgoConnect from "@randlabs/myalgo-connect";
import { Algodv2, makePaymentTxnWithSuggestedParamsFromObject } from "algosdk";
import setting from "../setting";

const encoder = new TextEncoder();

export const myAlgoConnect = new MyAlgoConnect();

export const signMessage = async (address: string, message: string) => {
  const algoClient = new Algodv2("", setting.ALGO_CLIENT, "");
  const params = await algoClient.getTransactionParams().do();
  const txn = makePaymentTxnWithSuggestedParamsFromObject({
    suggestedParams: params,
    from: address,
    to: address,
    amount: 0,
    note: encoder.encode(message),
  });

  const stx = await myAlgoConnect.signTransaction(txn.toByte());
  const b64Stx = Buffer.from(stx.blob).toString("base64");

  return b64Stx;
};

export const formatAddress = (address: string): string => {
  const length = address.length;
  return `${address.substring(0, 10)}...${address.substring(
    length - 4,
    length
  )}`;
};

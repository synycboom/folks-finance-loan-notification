// import algosdk, { SuggestedParams } from "algosdk";
// import MyAlgoWallet from "@randlabs/myalgo-connect";

/*Warning: Browser will block pop-up if user doesn't trigger myAlgoWallet.connect() with a button interation */
// export const signTransaction = async (
//   from: string,
//   to: string,
//   amount: number | bigint,
//   suggestedParams: SuggestedParams
//   ) => {
//     try {
//     const algodClient = new algosdk.Algodv2("", "https://api.algoexplorer.io/", "");
//     const myAlgoWallet = new MyAlgoWallet();
//     const txn = algosdk.makePaymentTxnWithSuggestedParams(
//       from,
//       to,
//       amount,
//       suggestedParams
//     );
//     const signedTxn = await myAlgoWallet.signTransaction(txn.toByte());
//     const response = await algodClient.sendRawTransaction(signedTxn.blob).do();
//     console.log(response);
//   } catch (err) {
//     console.error(err);
//   }
// };

export const formatAddress = (address: string): string => {
  const length = address.length;
  return `${address.substring(0, 10)}...${address.substring(
    length - 4,
    length
  )}`;
};

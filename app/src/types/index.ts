import { TestnetPoolKey } from "folks-finance-js-sdk";

export type Setting = {
  notifyDiscord: boolean;
  notifyTelegram: boolean;
  targetHealthFactor: number;
};

export type Loan = {
  borrowBalance: number;
  collateralBalance: number;
  healthFactor: number;
  escrowAddress: string;
  userAddress: string;
  tokenPair: string;
  borrowToken: TestnetPoolKey;
  collateralToken: TestnetPoolKey;
  setting?: Setting;
};

export type NotificationSetting = {
  userAddress: string;
  notifyDiscord: boolean;
  tokenPair: string;
  notifyTelegram: boolean;
  targetHealthFactor: number;
  currentHealthFactor: number;
  escrowAddress: string;
};

export type User = {
  publicAddress: string;
  discordConnectToken: string;
  telegramConnectToken: string;
  telegramUsername: string;
  telegramChatId: string;
  discordUserName: string;
  discordUserId: string;
};

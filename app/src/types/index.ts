import { TestnetPoolKey } from "folks-finance-js-sdk/src";

export type Loan = {
  borrowBalance: number;
  collateralBalance: number;
  healthFactor: number;
  escrowAddress: string;
  borrowToken: TestnetPoolKey;
  collateralToken: TestnetPoolKey;
};

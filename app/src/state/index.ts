import { atom } from "recoil";

export interface IAccountState {
  addresses: string[];
  selectedAddress: string;
  isConnect: boolean;
}

export const defaultAccountState: IAccountState = {
  addresses: [],
  selectedAddress: "",
  isConnect: false,
};

export const accountState = atom({
  key: "accountState",
  default: defaultAccountState,
});

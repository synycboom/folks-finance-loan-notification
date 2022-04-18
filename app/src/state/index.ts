import { atom } from "recoil";

export interface IAccountState {
  address: string;
  isConnect: boolean;
}

export const defaultAccountState: IAccountState = {
  address: "",
  isConnect: false,
};

export const accountState = atom({
  key: "accountState",
  default: defaultAccountState,
});

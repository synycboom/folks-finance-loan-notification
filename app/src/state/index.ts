import { atom } from "recoil";
import { User } from '../types';

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

export const defaultUserState: User = {
  publicAddress: '',
  discordConnectToken: '',
  telegramConnectToken: '',
  telegramUsername: '',
  telegramChatId: '',
  discordUserName: '',
  discordUserId: '',
};

export const userState = atom({
  key: "userState",
  default: defaultUserState,
});

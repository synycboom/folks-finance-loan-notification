import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { accountState, defaultAccountState } from "../state";
import { checkAuthen, logout } from "./api";

export const getAccounts = async () => {
  try {
    const address = await checkAuthen();
    return {
      address,
      isConnect: true,
    };
  } catch {
    return {
      address: "",
      isConnect: false,
    };
  }
};

export const useAccount = () => {
  const [account, setAccount] = useRecoilState(accountState);
  const navigate = useNavigate();

  const checkAuth = async () => {
    const account = await getAccounts();
    setAccount(account);
    return account;
  };

  const connect = (address: string) => {
    setAccount({
      address,
      isConnect: true,
    });
    navigate("/my-borrows");
  };

  const disconnect = async () => {
    await logout();
    window.localStorage.removeItem("token");
    setAccount(defaultAccountState);
    navigate("/");
  };

  return {
    account,
    connect,
    disconnect,
    checkAuth,
  };
};

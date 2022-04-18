import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { accountState, defaultAccountState } from "../state";

export const saveAddress = (address: string) => {
  localStorage.setItem("address", address);
};

export const removeAddress = () => {
  localStorage.removeItem("address");
};

export const getAccounts = () => {
  const address = localStorage.getItem("address") || "";
  return {
    address,
    isConnect: !!address,
  };
};

export const useAccount = () => {
  const [account, setAccount] = useRecoilState(accountState);
  const navigate = useNavigate();

  useEffect(() => {
    const account = getAccounts();
    setAccount(account);
  }, [setAccount]);

  const connect = (address: string) => {
    saveAddress(address);
    setAccount({
      address,
      isConnect: true,
    });
  };

  const disconnect = () => {
    setAccount(defaultAccountState);
    removeAddress();
    navigate("/");
  };

  // const changeAddress = (address: string) => {
  //   setAccount({
  //     ...account,
  //     address,
  //   });
  //   setAddresses(account.addresses, address);
  // };

  return {
    account,
    connect,
    // changeAddress,
    disconnect,
  };
};

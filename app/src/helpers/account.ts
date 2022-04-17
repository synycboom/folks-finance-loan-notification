import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { accountState, defaultAccountState } from "../state";

export const setAddresses = (addresses: string[], selectedAddress: string) => {
  localStorage.setItem("addresses", JSON.stringify(addresses));
  localStorage.setItem("selectedAddress", selectedAddress);
};

export const removeAddress = () => {
  localStorage.removeItem("addresses");
  localStorage.removeItem("selectedAddress");
};

export const getAccounts = () => {
  const addresses = JSON.parse(localStorage.getItem("addresses") || "[]");
  const selectedAddress = localStorage.getItem("selectedAddress") || "";
  return {
    addresses,
    selectedAddress,
    isConnect: !!addresses.length && !!selectedAddress,
  };
};

export const useAccount = () => {
  const [account, setAccount] = useRecoilState(accountState);
  const navigate = useNavigate();

  useEffect(() => {
    const account = getAccounts();
    setAccount(account);
  }, [setAccount]);

  const connect = (addresses: string[], selectedAddress: string) => {
    setAddresses(addresses, selectedAddress);
    setAccount({
      addresses,
      selectedAddress,
      isConnect: true,
    });
  };

  const disconnect = () => {
    setAccount(defaultAccountState);
    removeAddress();
    navigate("/");
  };

  const changeAddress = (selectedAddress: string) => {
    setAccount({
      ...account,
      selectedAddress,
    });
    setAddresses(account.addresses, selectedAddress);
  };

  return {
    account,
    connect,
    changeAddress,
    disconnect,
  };
};

import axios from "axios";
import setting from "../setting";
import { NotificationSetting, User } from "../types";
import message from "antd/lib/message";

axios.interceptors.request.use(async (config) => {
  const token = window.localStorage.getItem("token");
  if (token) {
    config.headers = { Authorization: `Bearer ${token}`, ...config.headers };
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        message.error("Your session has expired.");
      }
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export const getChallengeCode = async (address: string) => {
  const url = `${setting.SERVER_URL}/v1/auth/challenge?publicAddress=${address}`;
  const response = await axios.get<{ challenge: string }>(url);
  return response.data.challenge;
};

export const login = async (publicAddress: string, signedChallenge: string) => {
  const url = `${setting.SERVER_URL}/v1/auth/login`;
  const response = await axios.post(url, {
    signedChallenge,
    publicAddress,
  });
  const token = response.data.token;
  window.localStorage.setItem("token", token);
  return response.data;
};

export const logout = async () => {
  const url = `${setting.SERVER_URL}/v1/auth/logout`;
  const response = await axios.post(url);
  return response.data;
};

export const checkAuthen = async (): Promise<string> => {
  const instance = axios.create();
  const url = `${setting.SERVER_URL}/v1/auth/check`;
  const response = await instance.get(url);
  return response.data.publicAddress;
};

export const createOrUpdateNotification = async (data: NotificationSetting) => {
  const url = `${setting.SERVER_URL}/v1/notifications`;
  const response = await axios.post(url, data);
  return response.data;
};

export const getNotifications = async (): Promise<NotificationSetting[]> => {
  const url = `${setting.SERVER_URL}/v1/notifications/me`;
  const response = await axios.get(url);
  return response.data;
};

export const getUser = async (): Promise<User> => {
  const url = `${setting.SERVER_URL}/v1/users/me`;
  const response = await axios.get(url);

  return response.data;
};

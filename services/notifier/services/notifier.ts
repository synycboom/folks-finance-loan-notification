import axios from 'axios';
import { requireEnv } from '../utils/env';

const host = requireEnv('NOTIFIER_HOST');

export const notify = async (publicAddress: string, message: string, sendTo: string[]) => {
  return axios.post(`${host}/v1/notify`, {
    publicAddress,
    message,
    sendTo,
  });
}

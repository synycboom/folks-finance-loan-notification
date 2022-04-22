import { Telegraf } from 'telegraf';
import { isValidAddress } from 'algosdk';
import { requireEnv } from '../utils/env';
import logger from '../utils/logger';
import { findUser } from '../models/user';
import { NotFoundError } from '../errors';
import {
  INVALID_NONCE_MESSAGE,
  INVALID_PUBLIC_ADDRESS_MESSAGE,
  INTERNAL_ERROR_MESSAGE,
  TELEGRAM_PROMPT_MESSAGE,
  TELEGRAM_INVALID_CONNECT_TOKEN_MESSAGE,
} from './messages';

const botToken = requireEnv('TELEGRAM_BOT_TOKEN');
const bot = new Telegraf(botToken);

bot.command('start', (ctx) => {
  ctx.reply(TELEGRAM_PROMPT_MESSAGE);
});

bot.command('connect', async (ctx) => {
  const connectToken = ctx.message.text.replace('/connect ', '').trim();
  const split = connectToken.split(':');
  if (split.length !== 2) {
    ctx.reply(TELEGRAM_INVALID_CONNECT_TOKEN_MESSAGE);

    return;
  }

  const [publicAddress, nonce] = split;
  if (!isValidAddress(publicAddress)) {
    ctx.reply(TELEGRAM_INVALID_CONNECT_TOKEN_MESSAGE);

    return;
  }

  try {
    const chatId = ctx.message.chat.id;
    const username = ctx.from.username;
    const user = await findUser(publicAddress);

    if (nonce !== user.telegramNonce.toString()) {
      ctx.reply(INVALID_NONCE_MESSAGE);

      return;
    }

    await user.updateTelegram(username || '', chatId.toString());

    logger.info(`Algorand wallet ${publicAddress} is connected with ${username}`);
    ctx.reply(`Your Algorand wallet ${publicAddress} is connected with ${username}`);
  } catch (err: any) {
    if (err instanceof NotFoundError) {
      ctx.reply(INVALID_PUBLIC_ADDRESS_MESSAGE);

      return;
    }

    logger.error(err.message, { stack: err.stack });
    ctx.reply(INTERNAL_ERROR_MESSAGE);
  }
});

bot.launch();

logger.info('telegram bot is ready!');

// Enable graceful stop
['SIGTERM', 'SIGINT', 'SIGUSR2'].forEach(type => {
  process.once(type, async () => {
    try {
      bot.stop(type);
    } finally {
      process.kill(process.pid, type);
    }
  })
});

export const sendMessage = async (publicAddress: string, message: string) => {
  const user = await findUser(publicAddress);

  await bot.telegram.sendMessage(user.telegramChatId, message);
}

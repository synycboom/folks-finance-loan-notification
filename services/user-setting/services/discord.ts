import { Client } from 'discord.js';
import { isValidAddress } from 'algosdk';
import { requireEnv } from '../utils/env';
import { findUser } from '../models/user';
import { NotFoundError } from '../errors';
import logger from '../utils/logger';
import {
  INVALID_CONNECT_TOKEN_MESSAGE,
  INVALID_NONCE_MESSAGE,
  INVALID_PUBLIC_ADDRESS_MESSAGE,
  INTERNAL_ERROR_MESSAGE,
  PROMPT_MESSAGE,
  REPLY_MESSAGE,
} from './messages';

const INVOCATION_STRING_MESSAGE = '!verify';

// Create a new client instance
const client = new Client();
const discordToken = requireEnv('DISCORD_TOKEN');
const discordBotName = requireEnv('DISCORD_BOT_NAME');

// When the client is ready, run this code (only once)
client.once('ready', () => {
	logger.info('discord bot is ready!');
});

client.on('message', async (message) => {
  // INVOCATION IN PULIC CHANNEL
  if (message.content === INVOCATION_STRING_MESSAGE) {
    message.reply(REPLY_MESSAGE);
    message.author.send(PROMPT_MESSAGE);

    return;
  }

  // VERIFICATION IN DIRECT MESSAGE
  if (message.channel.type === 'dm') {
    const {
      username: handle,
      discriminator,
      id: userId
    } = message.author;

    if (handle === discordBotName) {
      return;
    }

    const connectToken = message.content.replace('!connect ', '').trim();
    const split = connectToken.split(':');
    if (split.length !== 2) {
      message.channel.send(INVALID_CONNECT_TOKEN_MESSAGE);

      return;
    }

    const [publicAddress, discordNonce] = split;
    if (!isValidAddress(publicAddress)) {
      message.channel.send(INVALID_CONNECT_TOKEN_MESSAGE);

      return;
    }

    try {
      const username = `${handle}#${discriminator}`;
      const user = await findUser(publicAddress);

      if (discordNonce !== user.discordNonce.toString()) {
        message.channel.send(INVALID_NONCE_MESSAGE);

        return;
      }

      await user.updateDiscord(username, userId);

      logger.info(`Algorand wallet ${publicAddress} is connected with ${username}`);
      message.channel.send(`Your Algorand wallet ${publicAddress} is connected with ${username}`);
    } catch (err: any) {
      if (err instanceof NotFoundError) {
        message.channel.send(INVALID_PUBLIC_ADDRESS_MESSAGE);

        return;
      }

      logger.error(err.message, { stack: err.stack });
      message.channel.send(INTERNAL_ERROR_MESSAGE);
    }
  }
});

// Login to Discord with your client's token
client.login(discordToken);

export const sendMessage = async (publicAddress: string, message: string) => {
  const user = await findUser(publicAddress);
  const discordUser = await client.users.fetch(user.discordUserId, true);

  await discordUser.send(message);
}

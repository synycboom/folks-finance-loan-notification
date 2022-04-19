import { Client } from 'discord.js';
import { isValidAddress } from 'algosdk';
import { requireEnv } from '../utils/env';
import { findUser } from '../models/user';
import { NotFoundError } from '../errors';
import logger from '../utils/logger';

const INVOCATION_STRING = '!verify';
const INVALID_CONNECT_TOKEN = `Oops! That doesn't look right. It looks like this 6DPZBXO5OPQOFVJA25EOZTGV54GM2GPT56FO5HNNBWOCBOYEFPUWMILVV4:1234`;
const INVALID_NONCE = `Oops! Invalid nonce`;
const INVALID_PUBLIC_ADDRESS = `Oops! Your discord connect token is not attached with any Algorand wallet`;
const INTERNAL_ERROR = `Oops! Something went wrong :(`;
const REPLY_MESSAGE = 'Please check your DMs';
const PROMPT_MESSAGE = 'Hi there! Lets get you verified. Reply with your wallet connect token. It looks like this "6DPZBXO5OPQOFVJA25EOZTGV54GM2GPT56FO5HNNBWOCBOYEFPUWMILVV4:1234"';

// Create a new client instance
const client = new Client();
const discordToken = requireEnv('DISCORD_TOKEN');
const discordBotName = requireEnv('DISCORD_BOT_NAME');

// When the client is ready, run this code (only once)
client.once('ready', () => {
	logger.info('discord bot is ready!');
});

client.on("message", async (message) => {
  // INVOCATION IN PULIC CHANNEL
  if (message.content === INVOCATION_STRING) {
    message.reply(REPLY_MESSAGE);
    message.author.send(PROMPT_MESSAGE);

    return;
  }

  // VERIFICATION IN DIRECT MESSAGE
  if (message.channel.type === "dm") {
    const {
      username: handle,
      discriminator,
      id: userId
    } = message.author;

    if (handle === discordBotName) {
      return;
    }

    const discordToken = message.content;
    const split = discordToken.split(':');
    if (split.length !== 2) {
      message.channel.send(INVALID_CONNECT_TOKEN);

      return;
    }

    const [publicAddress, discordNonce] = split;
    if (!isValidAddress(publicAddress)) {
      message.channel.send(INVALID_CONNECT_TOKEN);

      return;
    }

    try {
      const username = `${handle}#${discriminator}`;
      const user = await findUser(publicAddress);

      if (discordNonce !== user.discordNonce.toString()) {
        message.channel.send(INVALID_NONCE);

        return;
      }

      await user.updateDiscord(username, userId);

      logger.info(`Algorand wallet ${publicAddress} is connected with ${username}`);
      message.channel.send(`Your Algorand wallet ${publicAddress} is connected with ${username}`);
    } catch (err: any) {
      if (err instanceof NotFoundError) {
        message.channel.send(INVALID_PUBLIC_ADDRESS);

        return;
      }

      logger.error(err.message, { stack: err.stack });
      message.channel.send(INTERNAL_ERROR);
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

import mongoose from 'mongoose';
import { NotFoundError } from '../errors';

type UpdateUser = {
  discord?: string;
  telegram?: string;
}

const { Schema } = mongoose;

const generateConnectToken = (address: string, token: number) => `${address}:${token}`;

const randomNonce = () => Math.floor(Math.random() * 10000);

const schema = new Schema({
  publicAddress: {
    type: String,
    default: '',
  },
  discordUserName: {
    type: String,
    default: '',
  },
  discordUserId: {
    type: String,
    default: '',
  },
  discordNonce: {
    type: Number,
    default: () => randomNonce(),
  },
  telegramUsername: {
    type: String,
    default: '',
  },
  telegramChatId: {
    type: String,
    default: '',
  },
  telegramNonce: {
    type: Number,
    default: () => randomNonce(),
  },
  nonce: {
    type: Number,
    default: () => randomNonce(),
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
});

schema.methods.toResponse = function () {
  return {
    publicAddress: this.publicAddress,
    discordConnectToken: this.generateDiscordConnectToken(),
    telegramConnectToken: this.generateTelegramConnectToken(),
    telegramUsername: this.telegramUsername,
    telegramChatId: this.telegramChatId,
    discordUserName: this.discordUserName,
    discordUserId: this.discordUserId,
  };
};

schema.methods.generateDiscordConnectToken = function () {
  return generateConnectToken(this.publicAddress, this.discordNonce);
};

schema.methods.generateTelegramConnectToken = function () {
  return generateConnectToken(this.publicAddress, this.telegramNonce);
};

schema.methods.updateDiscord = async function (username: string, userId: string) {
  this.discordUserName = username;
  this.discordUserId = userId;
  this.discordNonce = randomNonce();
  this.updatedAt = new Date();

  await this.save();
};

schema.methods.updateTelegram = async function (username: string, chatId: string) {
  this.telegramUsername = username;
  this.telegramChatId = chatId;
  this.telegramNonce = randomNonce();
  this.updatedAt = new Date();

  await this.save();
};

export const User = mongoose.model('User', schema);

export const createUser = async (publicAddress: string) => {
  const filter = {
    publicAddress: publicAddress,
  };
  const update = {};
  const user = await User.findOneAndUpdate(filter, update, {
    upsert: true,
    new: true,
  });

  return user;
};

export const findUser = async (publicAddress: string) => {
  const user = await User.findOne({
    publicAddress: publicAddress,
  });
  if (!user) {
    throw new NotFoundError();
  }

  return user;
}

export const getNonce = async (publicAddress: string) => {
  const user = await findUser(publicAddress);

  return user.nonce;
};

export const updateNonce = async (publicAddress: string) => {
  await User.updateOne({
    publicAddress: publicAddress,
  }, {
    nonce: randomNonce(),
  });
};

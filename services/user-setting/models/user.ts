import mongoose from 'mongoose';
import { NotFoundError } from '../errors';

type UpdateUser = {
  discord: string;
  telegram: string;
}

const { Schema } = mongoose;

const randomNonce = () => Math.floor(Math.random() * 10000);

const schema = new Schema({
  publicAddress: {
    type: String,
    validate: {
      validator: function(v: string) {
        return v.toLocaleLowerCase() === v;
      },
      message: (props: any) => `${props.value} is not a lower case address`
    },
  },
  discord: {
    type: String,
    default: '',
  },
  telegram: {
    type: String,
    default: '',
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
    telegram: this.telegram,
    discord: this.discord,
  };
};

schema.methods.updateInfo = async function ({ discord, telegram }: UpdateUser) {
  this.discord = discord;
  this.telegram = telegram;
  this.updatedAt = new Date();

  await this.save();
};

export const User = mongoose.model('User', schema);

export const createUser = async (publicAddress: string) => {
  const filter = {
    publicAddress: publicAddress.toLowerCase(),
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
    publicAddress: publicAddress.toLowerCase(),
  });
  if (!user) {
    throw new NotFoundError();
  }

  return user;
}

export const updateUser = async (publicAddress: string, update: UpdateUser) => {
  const user = await User.findOne({
    publicAddress: publicAddress.toLowerCase(),
  });
  if (!user) {
    throw new NotFoundError();
  }

  await user.updateInfo(update);

  return user;
}

export const getNonce = async (publicAddress: string) => {
  const user = await findUser(publicAddress);

  return user.nonce;
};

export const updateNonce = async (publicAddress: string) => {
  await User.updateOne({
    publicAddress: publicAddress.toLowerCase(),
  }, {
    nonce: randomNonce(),
  });
};

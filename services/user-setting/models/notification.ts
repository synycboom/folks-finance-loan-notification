import mongoose from "mongoose";

const { Schema } = mongoose;

type NotificationSetting = {
  userAddress: string;
  notifyDiscord: boolean;
  tokenPair: string;
  notifyTelegram: boolean;
  targetHealthFactor: number;
  currentHealthFactor: number;
  escrowAddress: string;
};

const schema = new Schema({
  userAddress: {
    type: String,
    default: "",
  },
  escrowAddress: {
    type: String,
    default: "",
  },
  tokenPair: {
    type: String,
    default: "",
  },
  notifyDiscord: {
    type: Boolean,
    default: false,
  },
  notifyTelegram: {
    type: Boolean,
    default: false,
  },
  targetHealthFactor: {
    type: Number,
    default: 0,
  },
  currentHealthFactor: {
    type: Number,
    default: 0,
  },
  hasNotified: {
    type: Boolean,
    default: false,
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

export const NotificationSetting = mongoose.model(
  "NotificationSetting",
  schema
);

schema.methods.toResponse = function () {
  return {
    userAddress: this.userAddress,
    escrowAddress: this.escrowAddress,
    tokenPair: this.tokenPair,
    notifyDiscord: this.notifyDiscord,
    notifyTelegram: this.notifyTelegram,
    targetHealthFactor: this.targetHealthFactor,
    currentHealthFactor: this.currentHealthFactor,
    hasNotified: this.hasNotified,
  };
};

schema.methods.updateSetting = async function (
  notifyDiscord: boolean,
  notifyTelegram: boolean,
  targetHealthFactor: number
) {
  this.notifyDiscord = notifyDiscord;
  this.notifyTelegram = notifyTelegram;
  this.targetHealthFactor = targetHealthFactor;
  this.updatedAt = new Date();

  await this.save();
};

export const createNotificationSetting = async (data: NotificationSetting) => {
  const {
    userAddress,
    notifyDiscord,
    tokenPair,
    notifyTelegram,
    targetHealthFactor,
    currentHealthFactor,
    escrowAddress,
  } = data;
  const filter = {
    userAddress,
    escrowAddress,
    tokenPair,
  };
  const update = {
    notifyDiscord,
    notifyTelegram,
    targetHealthFactor,
    currentHealthFactor,
    hasNotified: false,
  };
  const notification = await NotificationSetting.findOneAndUpdate(
    filter,
    update,
    {
      upsert: true,
      new: true,
    }
  );

  return notification;
};

export const findNotificationsByAddress = (address: string) => {
  return NotificationSetting.find({
    userAddress: address,
  });
};

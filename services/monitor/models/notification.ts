import mongoose from "mongoose";

const { Schema } = mongoose;

export type NotificationSetting = {
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

export const getNotifications = () => {
  return NotificationSetting.find();
};

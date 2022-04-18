import mongoose from 'mongoose';
import { TestnetTokenPairs } from 'folks-finance-js-sdk/src';
import { NotFoundError } from '../errors';

const { Schema } = mongoose;

console.log(TestnetTokenPairs);
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

schema.methods.updateInfo = async function () {
  this.updatedAt = new Date();

  await this.save();
};

export const NotificationSetting = mongoose.model('NotificationSetting', schema);

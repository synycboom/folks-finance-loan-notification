import express from 'express';
import asyncHandler from 'express-async-handler';
import { ExtendedRequest } from './types';
import { ValidationError } from '../errors';
import { validationResult, checkSchema } from "express-validator";
import { sendMessage as sendDiscordMessage } from '../services/discord';
import { sendMessage as sendTelegramMessage } from '../services/telegram';
import logger from '../utils/logger';

const router = express.Router();

const validation = checkSchema({
  publicAddress: {
    custom: {
      options: (value: string) => {
        if (!value) {
          throw new Error('publicAddress is empty');
        }

        return true;
      },
    },
  },
  message: {
    custom: {
      options: (value: string) => {
        if (!value) {
          throw new Error('message is empty');
        }

        return true;
      },
    },
  },
  sendTo: {
    custom: {
      options: async (sendTo) => {
        if (!(sendTo instanceof Array)) {
          throw new Error('sendTo is not an array');
        }

        return true;
      },
    },
  },
});

router.post(
  '/',
  validation,
  asyncHandler(async (req: ExtendedRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array());
    }

    const { publicAddress, message: sendingMessage, sendTo } = req.body;
    const userAddress = publicAddress.trim();

    if (sendTo.includes('telegram')) {
      sendTelegramMessage(userAddress, sendingMessage).catch((err) => {
        logger.error(err.message, { stack: err.stack });
      });
    }
    if (sendTo.includes('discord')) {
      sendDiscordMessage(userAddress, sendingMessage).catch((err) => {
        logger.error(err.message, { stack: err.stack });
      });
    }

    res.status(200).json({});
  })
);

export default router;

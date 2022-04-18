import jwt from 'jsonwebtoken';
import express from 'express';
import asyncHandler from 'express-async-handler';
import { decodeAddress } from 'algosdk';
import { body, checkSchema, validationResult, param } from 'express-validator';
import { ValidationError } from '../errors';
import { createUser, updateNonce, findUser, getNonce, updateUser } from '../models/user';
import { requireEnv } from '../utils/env';
import { authenticateToken } from './middlewares';

const router = express.Router();

const validatePublicAddress = (value: string) => {
  decodeAddress(value);

  return true;
};

const getUserValidation = checkSchema({
  publicAddress: {
    custom: {
      options: validatePublicAddress,
    },
  },
}, ['query']);

const updateUserValidation = checkSchema({
  publicAddress: {
    custom: {
      options: validatePublicAddress,
    },
  },
}, ['body']);

router.get(
  '/',
  getUserValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array());
    }

    const publicAddress = req.query.publicAddress?.toString() || '';
    const user = await findUser(publicAddress);

    res.status(200).json(user.toResponse());
  }),
);

router.post(
  '/',
  updateUserValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array());
    }

    const publicAddress = req.body.publicAddress?.toString() || '';
    const discord = req.body.discord?.toString() || '';
    const telegram = req.body.telegram?.toString() || '';
    const user = await updateUser(publicAddress, { discord, telegram });

    res.status(200).json(user.toResponse());
  }),
);

export default router;

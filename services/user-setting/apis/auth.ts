import jwt from 'jsonwebtoken';
import express from 'express';
import asyncHandler from 'express-async-handler';
import { validationResult, checkSchema } from 'express-validator';
import { encodeAddress, decodeAddress, encodeObj, decodeSignedTransaction, isValidAddress } from 'algosdk';
import nacl from "tweetnacl";
import isBase64 from 'validator/lib/isBase64';
import { ValidationError } from '../errors';
import { createUser, updateNonce, findUser, getNonce } from '../models/user';
import { requireEnv } from '../utils/env';
import { generateChallenge } from '../utils/auth';
import { authenticateToken } from './middlewares';

const router = express.Router();

export const generateAccessToken = (userId: string, publicAddress: string) => {
  return jwt.sign({ userId, publicAddress }, requireEnv('TOKEN_SECRET'), { expiresIn: '1800s' });
}

const validateSignature = (sig: string) => {
  return isBase64(sig);
};

const validatePublicAddress = (value: string) => {
  decodeAddress(value);

  return true;
};

const verifySignedTransaction = (publicAddress: string, challenge: string, data: string) => {
  const stxn = decodeSignedTransaction(Buffer.from(data, 'base64'));
  if (!stxn.sig) {
    return false;
  };

  const pkBytes = stxn.txn.from.publicKey;
  const sigBytes = new Uint8Array(stxn.sig);
  const txnBytes = encodeObj(stxn.txn.get_obj_for_encoding());
  const msgBytes = new Uint8Array(txnBytes.length + 2);

  msgBytes.set(Buffer.from("TX"));
  msgBytes.set(txnBytes, 2);

  if (Buffer.from(stxn.txn.note || []).toString() !== challenge) {
    return false;
  }
  if (encodeAddress(pkBytes) !== publicAddress) {
    return false;
  }

  return nacl.sign.detached.verify(msgBytes, sigBytes, pkBytes);
}

const challengeValidation = checkSchema(
  {
    publicAddress: {
      custom: {
        options: validatePublicAddress,
      },
    },
  },
  ['query'],
);

const loginValidation = checkSchema({
  publicAddress: {
    custom: {
      options: validatePublicAddress,
    },
  },
  signedChallenge: {
    custom: {
      options: async (signedChallenge, { req }) => {
        const { publicAddress } = req.body;

        if (!validateSignature(signedChallenge)) {
          throw new Error('signedChallenge is not valid');
        }
        if (!isValidAddress(publicAddress)) {
          throw new Error('publicAddress is not valid');
        }

        const nonce = await getNonce(publicAddress);
        const challenge = generateChallenge(nonce);

        if (!verifySignedTransaction(publicAddress, challenge, signedChallenge)) {
          throw new Error('signedChallenge is not valid');
        }

        return true;
      },
    },
  },
});

router.get(
  '/challenge',
  challengeValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array());
    }

    const publicAddress = req.query.publicAddress?.toString() || '';
    const user = await createUser(publicAddress);
    const challenge = generateChallenge(user.nonce);

    res.status(200).json({
      challenge,
    });
  }),
);

router.post(
  '/login',
  loginValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array());
    }

    const publicAddress = req.body.publicAddress;
    const user = await findUser(publicAddress);
    const token = generateAccessToken(user._id, publicAddress);
    await updateNonce(publicAddress);

    res.cookie('jwt', token, { httpOnly: true }).status(200).json({
      token,
    });
  }),
);

router.post(
  '/logout',
  asyncHandler(async (req, res) => {
    res.clearCookie('jwt').status(204).end();
  }),
);

router.get(
  '/check',
  authenticateToken,
  asyncHandler(async (req, res) => {
    res.status(200).json({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      publicAddress: req.publicAddress,
    });
  }),
);

export default router;

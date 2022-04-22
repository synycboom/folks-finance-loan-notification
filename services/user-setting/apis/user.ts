import express from 'express';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import { ExtendedRequest } from './types';
import { ValidationError } from '../errors';
import { findUser } from '../models/user';

const router = express.Router();

router.get(
  '/me',
  asyncHandler(async (req: ExtendedRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array());
    }

    const publicAddress = req.publicAddress || '';
    const user = await findUser(publicAddress);

    res.status(200).json(user.toResponse());
  }),
);

export default router;

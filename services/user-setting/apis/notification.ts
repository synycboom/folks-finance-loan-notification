import express from "express";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import { ExtendedRequest } from "./types";
import { ValidationError } from "../errors";
import {
  createNotificationSetting,
  findNotificationsByAddress,
} from "../models/notification";

const router = express.Router();

router.post(
  "/",
  asyncHandler(async (req: ExtendedRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array());
    }

    const notification = await createNotificationSetting(req.body);
    console.log(notification);
    res.status(200).json(notification);
  })
);

router.get(
  "/me",
  asyncHandler(async (req: ExtendedRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array());
    }

    const publicAddress = req.publicAddress || "";
    const notifications = await findNotificationsByAddress(publicAddress);

    res.status(200).json(notifications);
  })
);

export default router;

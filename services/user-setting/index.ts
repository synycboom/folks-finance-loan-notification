import * as dotenv from "dotenv";

dotenv.config();

import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./apis/auth";
import userRoutes from "./apis/user";
import notificationRoutes from "./apis/notification";
import notifyRoutes from "./apis/notify";
import logger from "./utils/logger";
import { errorHandler } from "./errors";
import initializeDb from "./db";
import { authenticateToken } from "./apis/middlewares";
import "./services/discord";
import "./services/telegram";

// Public APIs
const publicApp: Application = express();
const publicPort = process.env.PORT || 8080;
const domains: string[] = ['.web.app'];

publicApp.use(
  cors({
    origin: [/localhost:*/, ...domains],
    credentials: true,
  })
);

publicApp.use(express.json());
publicApp.use(express.urlencoded({ extended: true }));
publicApp.use(cookieParser());
publicApp.use("/v1/auth", authRoutes);
publicApp.use("/v1/users", authenticateToken, userRoutes);
publicApp.use("/v1/notifications", authenticateToken, notificationRoutes);
publicApp.use(errorHandler);

// Internal APIs
const internalApp: Application = express();
const internalPort = process.env.INTERNAL_PORT || 18080;

internalApp.use(express.json());
internalApp.use(express.urlencoded({ extended: true }));
internalApp.use("/v1/notify", notifyRoutes);
internalApp.use(errorHandler);

async function start() {
  logger.info("initializing database connection...");

  await initializeDb();

  publicApp.get("/health", (_, res) => {
    res.send("ok");
  });
  publicApp.listen(publicPort, (): void => {
    logger.info(`running server on port ${publicPort}`);
  });

  internalApp.get("/health", (_, res) => {
    res.send("ok");
  });
  internalApp.listen(internalPort, (): void => {
    logger.info(`running internal server on port ${internalPort}`);
  });
}

start().catch((err) => {
  logger.error(err.message, { stack: err.stack });
  process.exit(1);
});

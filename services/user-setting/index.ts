import * as dotenv from "dotenv";

dotenv.config();

import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./apis/auth";
import userRoutes from "./apis/user";
import notificationRoutes from "./apis/notification";
import logger from "./utils/logger";
import { errorHandler } from "./errors";
import initializeDb from "./db";
import { authenticateToken } from "./apis/middlewares";
import "./services/discord";
import "./services/telegram";

const app: Application = express();
const port = process.env.PORT || 8080;
const domains: string[] = [];

app.use(
  cors({
    origin: [/localhost:*/, ...domains],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/v1/auth", authRoutes);
app.use("/v1/users", authenticateToken, userRoutes);
app.use("/v1/notifications", authenticateToken, notificationRoutes);
app.use(errorHandler);

async function start() {
  logger.info("initializing database connection...");

  await initializeDb();

  app.get("/health", (_, res) => {
    res.send("ok");
  });
  app.listen(port, (): void => {
    logger.info(`running server on port ${port}`);
  });
}

start().catch((err) => {
  logger.error(err.message, { stack: err.stack });
  process.exit(1);
});

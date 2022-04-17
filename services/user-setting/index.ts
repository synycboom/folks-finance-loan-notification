import * as dotenv from 'dotenv';

dotenv.config();

import express, { Application } from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app: Application = express();
const port = process.env.PORT || 8080;
const domains: string[] = [];

app.use(
  cors({
    origin: [/localhost:*/, ...domains],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

async function start() {
  app.listen(port, (): void => {
    console.log(`Running server on port ${port}`);
  });
}

start().catch((err) => {
  console.error(err.message, { stack: err.stack });
  process.exit(1);
});

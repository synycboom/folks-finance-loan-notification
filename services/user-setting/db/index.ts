import mongoose from 'mongoose';
import { requireEnv } from '../utils/env';

export default async function initialize() {
  const uri = `mongodb://${requireEnv('DB_USERNAME')}:${requireEnv('DB_PASSWORD')}@${requireEnv('DB_HOST')}:${requireEnv('DB_PORT')}`;

  await  mongoose.connect(uri, {
    autoIndex: false,
    maxPoolSize: 20,
    dbName: requireEnv('DB_NAME'),
  });
}

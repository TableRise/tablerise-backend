/* eslint-disable no-console */
import mongoose from 'mongoose';
import 'dotenv/config';

const MONGODB_USERNAME = process.env.MONGODB_USERNAME ?? 'root';
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD ?? 'secret';
const MONGODB_HOST = process.env.MONGODB_HOST ?? 'localhost';
const MONGODB_PORT = process.env.MONGODB_PORT ?? 27017;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE ?? 'tavern-data?authSource=admin';
const MONGODB_CONNECTION_INITIAL = process.env.MONGODB_CONNECTION_INITIAL ?? 'mongodb';

export default class ConnectMongoInstance {
  static async connect(): Promise<void> {
    await mongoose
      .connect(`${MONGODB_CONNECTION_INITIAL}://${MONGODB_USERNAME}:
      ${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}`)
      .then(() => { console.log('MongoDB connected successfully') })
      .catch((err) => { throw err });
  }

  static async connectInTest(): Promise<void> {
    await mongoose
      .connect('mongodb://root:secret@127.0.0.1:27018/tablerise?authSource=admin')
      .then(() => { console.log('MongoDB connected successfully') })
      .catch((err) => { throw err });
  }
}

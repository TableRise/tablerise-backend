/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable no-console */
import mongoose from 'mongoose';
import 'dotenv/config';

const MONGODB_USERNAME = process.env.MONGODB_USERNAME || 'root';
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || 'secret';
const MONGODB_HOST = process.env.MONGODB_HOST || '127.0.0.1';
const MONGODB_PORT = process.env.MONGODB_PORT || 27017;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'tablerise?authSource=admin';
const MONGODB_CONNECTION_INITIAL = process.env.MONGODB_CONNECTION_INITIAL || 'mongodb';

const MONGODB_USERNAME_PROD = process.env.MONGODB_USERNAME_PROD as string;
const MONGODB_PASSWORD_PROD = process.env.MONGODB_PASSWORD_PROD as string;
const MONGODB_HOST_PROD = process.env.MONGODB_HOST_PROD as string;
const MONGODB_PORT_PROD = process.env.MONGODB_PORT_PROD as string;
const MONGODB_DATABASE_PROD = process.env.MONGODB_DATABASE_PROD as string;
const MONGODB_CONNECTION_INITIAL_PROD = process.env.MONGODB_CONNECTION_INITIAL_PROD as string;

export default class ConnectMongoInstance {
  static async connect(): Promise<boolean> {
    const environment = process.env.ENVIRONMENT_PROD_DEV || 'dev';

    if (environment === 'prod') {
      const firstSection = `${MONGODB_CONNECTION_INITIAL_PROD}://${MONGODB_USERNAME_PROD}`;
      const secondSection = `:${MONGODB_PASSWORD_PROD}@${MONGODB_HOST_PROD}`;
      const thirdSection = `:${MONGODB_PORT_PROD}/${MONGODB_DATABASE_PROD}`;

      await mongoose
        .connect(firstSection + secondSection + thirdSection)
        .then(() => { console.log('MongoDB Instance Connected') })
        .catch((error) => { throw error });
      return true;
    }

    const firstSection = `${MONGODB_CONNECTION_INITIAL}://${MONGODB_USERNAME}:${MONGODB_PASSWORD}`;
    const secondSection = `@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}`;

    await mongoose
      .connect(firstSection + secondSection)
      .then(() => { console.log('MongoDB Instance Connected') })
      .catch((error) => { throw error });
    return true;
  }

  static async connectInTest(): Promise<boolean> {
    await mongoose
      .connect('mongodb://root:secret@127.0.0.1:27018/tablerise?authSource=admin')
      .then(() => { console.log('MongoDB Test Instance Connected') })
      .catch((error) => { throw error });
    return true;
  }
}

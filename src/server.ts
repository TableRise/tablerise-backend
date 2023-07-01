/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import app from './app';
import mongoose from 'mongoose';

const port = process.env.PORT || 3001;

const MONGODB_USERNAME = process.env.MONGODB_USERNAME || 'root';
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || 'secret';
const MONGODB_HOST = process.env.MONGODB_HOST || '127.0.0.1';
const MONGODB_PORT = process.env.MONGODB_PORT || 27017;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'tablerise?authSource=admin';
const MONGODB_CONNECTION_INITIAL = process.env.MONGODB_CONNECTION_INITIAL || 'mongodb';

const firstSection = `${MONGODB_CONNECTION_INITIAL}://${MONGODB_USERNAME}:${MONGODB_PASSWORD}`;
const secondSection = `@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}`;

mongoose
  .connect(firstSection + secondSection)
  .then(() => { console.log(':: MongoDB Instance Connected ::') })
  .catch((error) => { throw error });

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

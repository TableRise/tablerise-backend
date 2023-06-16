/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import app from './app';
import mongoose from 'mongoose';
import 'dotenv/config';

const port = process.env.PORT || 3001;

const MONGODB_USERNAME = process.env.MONGODB_USERNAME || 'root';
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || 'secret';
const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost';
const MONGODB_PORT = process.env.MONGODB_PORT || 27017;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'tavern-data?authSource=admin';
const MONGODB_CONNECTION_INITIAL = process.env.MONGODB_CONNECTION_INITIAL || 'mongodb';

mongoose.connect(`${MONGODB_CONNECTION_INITIAL}://${MONGODB_USERNAME}:
${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}`)
  .then(() => { console.log('MongoDB connected successfully'); })
  .catch((err) => { console.log(err); });

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

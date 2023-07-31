/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import app from './app';
import mongoose from 'mongoose';
import 'dotenv/config';

const logger = require('@tablerise/dynamic-logger');

const port = process.env.PORT as string;

const MONGODB_USERNAME = process.env.MONGODB_USERNAME as string;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD as string;
const MONGODB_HOST = process.env.MONGODB_HOST as string;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE as string;
const MONGODB_CONNECTION_INITIAL = process.env.MONGODB_CONNECTION_INITIAL as string;

const firstSection = `${MONGODB_CONNECTION_INITIAL}://${MONGODB_USERNAME}:${MONGODB_PASSWORD}`;
const secondSection = `@${MONGODB_HOST}/${MONGODB_DATABASE}`;

mongoose
    .connect(firstSection + secondSection)
    .then(() => {
        logger('success', ':: MongoDB Instance Connected ::');
    })
    .catch((error) => {
        logger('error', 'Connection to MongoDB failed');
        throw error;
    });

app.listen(port, () => {
    logger('success', `Server started on port ${port}`);
});

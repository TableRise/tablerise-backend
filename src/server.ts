/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import app from './app';
import mongoose from 'mongoose';
import 'dotenv/config';

const logger = require('@tablerise/dynamic-logger');
const tableriseEnvs = require('../tablerise.environment.js');

const port = process.env.PORT as string;

const username = tableriseEnvs.database_username as string;
const password = tableriseEnvs.database_password as string;
const host = tableriseEnvs.database_host as string;
const database = tableriseEnvs.database_database as string;
const initialString = tableriseEnvs.database_initialString as string;

mongoose.connect(`${initialString}://${username}:${password}@${host}/${database}`)
    .then(() => logger('info', 'Database connected with sucess - [ Dungeons & Dragons ]'))
    .catch(() => logger('error', 'Database connection failed'));

app.listen(port, () => {
    logger('info', `Server started on port ${port}`);
});

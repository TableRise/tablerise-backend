/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import app from './app';
import 'dotenv/config';

const logger = require('@tablerise/dynamic-logger');

const port = process.env.PORT as string;

app.listen(port, () => {
    logger('info', `Server started on port ${port}`);
});

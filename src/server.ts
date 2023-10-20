/* eslint-disable import/first */
import 'module-alias/register';
import setup from './container';
setup();

import DatabaseManagement from '@tablerise/database-management';
import app from './app';
import logger from '@tablerise/dynamic-logger';

const port = process.env.PORT as string;

DatabaseManagement.connect(true)
    .then(() => {
        logger('info', 'Database connection instanciated');
    })
    .catch(() => {
        logger('error', 'Database connection failed');
    });

app.listen(port, () => {
    logger('info', `Server started on port ${port}`);
});

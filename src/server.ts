/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import app from './app';
import mongoose from 'mongoose';
import generateMongoURI from './support/helpers/generateMongoURI';
import TableRiseConnections from './types/TableRiseConnections';
import 'dotenv/config';

const logger = require('@tablerise/dynamic-logger');

const port = process.env.PORT as string;

const connections: TableRiseConnections = {
    'dungeons&dragons5e': {} as mongoose.Connection
};

try {
    connections['dungeons&dragons5e'] = mongoose.createConnection(generateMongoURI('dungeons&dragons5e'));
    logger('info', 'Dungeons and Dragons 5° Edition - Databse Connection Instanciated');
} catch (error) {
    logger('error', 'Some connection with mongoose had fail, please verify connections');
    throw error;
}

app.listen(port, () => {
    logger('info', `Server started on port ${port}`);
});

export default connections;

import TableRiseConnections from 'src/types/TableRiseConnections';
import mongoose from 'mongoose';
import generateMongoURI from 'src/support/helpers/generateMongoURI';

const logger = require('@tablerise/dynamic-logger');

const connections: TableRiseConnections = {
    'dungeons&dragons5e': {} as mongoose.Connection
};

try {
    connections['dungeons&dragons5e'] = mongoose.createConnection(generateMongoURI('dungeons&dragons5e'));
    logger('info', 'Dungeons and Dragons 5° Edition - Database Connection Instanciated');
} catch (error) {
    logger('error', 'Some connection with mongoose had fail, please verify connections');
    throw error;
}

export default connections;

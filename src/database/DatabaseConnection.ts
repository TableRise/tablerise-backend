import TableRiseConnections from 'src/types/TableRiseConnections';
import mongoose from 'mongoose';
import generateMongoURI from 'src/support/helpers/generateMongoURI';

const logger = require('@tablerise/dynamic-logger');

const connections: TableRiseConnections = {
    'dungeons&dragons5e': {} as mongoose.Connection,
};

connections['dungeons&dragons5e'] = mongoose.createConnection(generateMongoURI('dungeons&dragons5e'));
logger('info', 'Dungeons and Dragons 5° Edition - Database Connection Instanciated');

export default connections;

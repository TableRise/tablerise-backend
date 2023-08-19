/* eslint-disable no-console */
import Connections from 'src/database/DatabaseConnection';

Connections['dungeons&dragons5e']
    .close()
    .then(() => {})
    .catch((error) => {
        throw error;
    });

import { Logger } from 'src/types/Logger';

const tableriseEnvironment = require('../tablerise.environment.js');

export interface TwoFactorHandlerContract {
    configs: typeof tableriseEnvironment;
    logger: Logger;
}

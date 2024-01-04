import { Logger } from 'src/types/Logger';

const tableriseEnvironment = require('../tablerise.environment.js');

export interface TwoFactorHandlerContract {
    configs: typeof tableriseEnvironment;
    logger: Logger;
}

export interface TwoFactorValidatePayload {
    secret: string;
    token: string;
}

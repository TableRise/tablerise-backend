import Configs from 'src/types/shared/configs';
import { Logger } from 'src/types/shared/logger';

export interface TwoFactorHandlerContract {
    configs: Configs;
    logger: Logger;
}

export interface TwoFactorValidatePayload {
    secret: string;
    token: string;
}

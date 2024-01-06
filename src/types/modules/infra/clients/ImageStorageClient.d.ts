import Configs from 'src/types/shared/configs';
import { Logger } from 'src/types/shared/logger';
import axios from 'axios';

export interface ImageStorageClientContract {
    logger: Logger;
    httpRequest: typeof axios;
    configs: Configs
}

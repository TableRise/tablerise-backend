import configs from 'src/infra/configs';
import { Logger } from '../Logger';
import axios from 'axios';

export interface ImageStorageClientContract {
    configs: typeof configs;
    logger: Logger;
    httpRequest: typeof axios;
}

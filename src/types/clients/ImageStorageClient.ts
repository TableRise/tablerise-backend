import configs from 'src/infra/configs';
import { Logger } from '../Logger';

export interface ImageStorageClientContract {
    configs: typeof configs
    logger: Logger;
}

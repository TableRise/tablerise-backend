import { Logger } from '../Logger';
import axios from 'axios';

export interface ImageStorageClientContract {
    logger: Logger;
    httpRequest: typeof axios;
}

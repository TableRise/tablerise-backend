import Configs from 'src/types/shared/configs';
import { Logger } from 'src/types/shared/logger';
import axios from 'axios';
import Serializer from 'src/domains/common/helpers/Serializer';

export interface ImageStorageClientContract {
    logger: Logger;
    httpRequest: typeof axios;
    serializer: Serializer;
    configs: Configs;
}

interface ImageData {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
}

interface ResponseData {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: string;
    height: string;
    size: string;
    time: string;
    expiration: string;
    image: ImageData;
    thumb: ImageData;
    medium: ImageData;
    delete_url: string;
}

export interface ApiImgBBResponse {
    data: ResponseData;
    success: boolean;
    status: number;
}

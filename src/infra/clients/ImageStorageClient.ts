import axios, { AxiosResponse } from 'axios';
import { FileObject } from 'src/types/File';
import { ImageStorageClientContract } from 'src/types/clients/ImageStorageClient';

export default class ImageStorageClient {
    private readonly _logger;
    private readonly _configs;

    constructor({ logger, configs }: ImageStorageClientContract) {
        this._logger = logger;
        this._configs = configs
    }

    async upload(image: FileObject): Promise<AxiosResponse> {
        this._logger('info', 'Upload - ImageStorageClient');
        const { baseUrl, authorization, endpoints } = this._configs.api.imgur;

        const url = baseUrl + endpoints.postImage;

        const imageUploaded = await axios({
            method: 'post',
            url,
            data: Buffer.from(image.buffer, 'base64'),
            headers: {
                "Content-Type": "text/plain",
                "Authorization": authorization
            },
        });

        return imageUploaded.data;
    }
}

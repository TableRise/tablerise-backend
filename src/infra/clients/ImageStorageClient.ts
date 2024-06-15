import { FileObject } from 'src/types/shared/file';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';
import { ApiImgBBResponse } from 'src/types/modules/infra/clients/ImageStorageClient';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';

export default class ImageStorageClient {
    private readonly _logger;
    private readonly _configs;
    private readonly _httpRequest;
    private readonly _serializer;

    constructor({
        logger,
        httpRequest,
        configs,
        serializer
    }: InfraDependencies['imageStorageClientContract']) {
        this._logger = logger;
        this._configs = configs;
        this._httpRequest = httpRequest;
        this._serializer = serializer;
    }

    async upload(image: FileObject, customTitle?: string): Promise<ImageObject> {
        this._logger('info', 'Upload - ImageStorageClient');
        const { baseUrl, authorization, endpoints } = this._configs.api.imgur;

        const url = `${baseUrl}${endpoints.postImage}${authorization}`;

        const form = new FormData();
        form.append('name', image.originalname);
        form.append('image', image.buffer);

        const imageUploaded =
            process.env.NODE_ENV === 'production'
                ? await this._httpRequest({
                      method: 'post',
                      url,
                      data: form,
                      headers: {
                          'Content-Type': 'text/plain',
                      },
                  })
                : {
                      data: {
                        thumb: {},
                        medium: {},
                        delete_url: ''
                      },
                      success: true,
                      status: 200
                  };

        imageUploaded.data.title = customTitle ?? imageUploaded.data.title;

        return this._serializer.imageResult(imageUploaded as ApiImgBBResponse);
    }
}

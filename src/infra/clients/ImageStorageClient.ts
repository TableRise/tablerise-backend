import { FileObject } from 'src/types/shared/file';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';
import { ApiImgBBResponse } from 'src/types/modules/infra/clients/ImageStorageClient';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import FormData from 'form-data';
import { AxiosError, AxiosResponse } from 'axios';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import sharp from 'sharp';

export default class ImageStorageClient {
    private readonly logger;
    private readonly configs;
    private readonly httpRequest;
    private readonly serializer;

    constructor({ logger, httpRequest, configs, serializer }: InfraDependencies['imageStorageClientContract']) {
        this.logger = logger;
        this.configs = configs;
        this.httpRequest = httpRequest;
        this.serializer = serializer;

        this.convertToWebp = this.convertToWebp.bind(this);
    }

    async upload(image: FileObject, customTitle?: string): Promise<ImageObject> {
        const callName = `[${this.constructor.name}] - ${this.upload.name}`;
        this.logger('info', callName);
        const { baseUrl, authorization, endpoints } = this.configs.api.imgur;

        const url = `${baseUrl}${endpoints.postImage}${authorization}`;

        let imageUploaded: AxiosResponse | ApiImgBBResponse;

        imageUploaded = {
            data: {
                data: {
                    thumb: {},
                    medium: {},
                    delete_url: '',
                },
            },
            success: true,
            status: 200,
        } as ApiImgBBResponse;

        try {
            const imageWebp = await this.convertToWebp(image);
            const form = new FormData();
            form.append('name', imageWebp.originalname);
            form.append('image', Buffer.from(imageWebp.buffer).toString('base64'));

            const imageUploadPayload = {
                method: 'post',
                url,
                data: form,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            imageUploaded =
                process.env.NODE_ENV === 'production' ? await this.httpRequest(imageUploadPayload) : imageUploaded;
        } catch (error) {
            const err = error as AxiosError;

            throw new HttpRequestErrors({
                message: err.message,
                code: 500,
                name: err.name,
            });
        }

        imageUploaded.data.title = customTitle ?? imageUploaded.data.title;

        return this.serializer.imageResult(imageUploaded as ApiImgBBResponse);
    }

    private async convertToWebp(image: FileObject): Promise<FileObject> {
        const buffer = await sharp(image.buffer).webp().toBuffer();
        const baseName = image.originalname.replace(/\.[^.]+$/, '');

        return {
            ...image,
            originalname: `${baseName}.webp`,
            mimetype: 'image/webp',
            buffer,
            size: buffer.length,
        };
    }
}

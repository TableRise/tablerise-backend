import ImageStorageClient from 'src/infra/clients/ImageStorageClient';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { FileObject } from 'src/types/shared/file';

describe('Infra :: Clients :: ImageStorageClient', () => {
    let imageStorageClient: ImageStorageClient,
        configs: any,
        serializer: any,
        httpRequest: any,
        imageMock: FileObject;

    const logger = (): void => {};

    context('#upload', () => {
        const bufferMock = Buffer.from('', 'binary');

        before(() => {
            configs = {
                api: {
                    imgur: {
                        baseUrl: '',
                        authorization: '',
                        endpoints: {
                            postImage: '',
                        },
                    },
                },
            };

            httpRequest = () => ({ data: { title: 'upload test' } });

            imageMock = {
                buffer: bufferMock,
                mimetype: 'image/png',
                originalname: 'test.png',
                fieldname: 'file',
                encoding: 'utf-8',
                size: 154,
            };

            serializer = {
                imageResult: () => DomainDataFaker.generateImagesObjectJSON()[0],
            };

            imageStorageClient = new ImageStorageClient({
                logger,
                configs,
                serializer,
                httpRequest,
            });
        });

        it('should correctly upload the picture', async () => {
            process.env.NODE_ENV = 'production';
            const imageUp = await imageStorageClient.upload(imageMock);

            expect(imageUp).to.have.property('id');
            expect(imageUp).to.have.property('title');
            expect(imageUp).to.have.property('link');
            expect(imageUp).to.have.property('uploadDate');
            expect(imageUp).to.have.property('request');
            process.env.NODE_ENV = 'develop';
        });

        it('should correctly upload the picture - No Prod', async () => {
            const imageUp = await imageStorageClient.upload(imageMock);
            expect(imageUp).to.have.property('id');
            expect(imageUp).to.have.property('title');
            expect(imageUp).to.have.property('link');
            expect(imageUp).to.have.property('uploadDate');
            expect(imageUp).to.have.property('request');
        });

        it('should correctly upload the picture - No Prod and Custom title', async () => {
            const imageUp = await imageStorageClient.upload(imageMock, 'custom');
            expect(imageUp).to.have.property('id');
            expect(imageUp).to.have.property('title');
            expect(imageUp).to.have.property('link');
            expect(imageUp).to.have.property('uploadDate');
            expect(imageUp).to.have.property('request');
        });
    });
});

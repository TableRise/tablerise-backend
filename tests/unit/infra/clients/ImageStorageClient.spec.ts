import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import ImageStorageClient from 'src/infra/clients/ImageStorageClient';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { FileObject } from 'src/types/shared/file';
import sharp from 'sharp';

describe('Infra :: Clients :: ImageStorageClient', () => {
    let imageStorageClient: ImageStorageClient, configs: any, serializer: any, httpRequest: any, imageMock: FileObject;

    const logger = (): void => {};
    let pngBufferMock: Buffer;

    before(async () => {
        pngBufferMock = await sharp({
            create: {
                width: 1,
                height: 1,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 },
            },
        })
            .png()
            .toBuffer();
    });

    context('#upload', () => {
        context('When upload is made successfully', () => {
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
                    buffer: pngBufferMock,
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

            it('should convert uploaded images to webp before sending them upstream', async () => {
                const convertedImage = await (imageStorageClient as any).convertToWebp(imageMock);
                const metadata = await sharp(convertedImage.buffer).metadata();

                expect(convertedImage.originalname).to.equal('test.webp');
                expect(convertedImage.mimetype).to.equal('image/webp');
                expect(metadata.format).to.equal('webp');
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

        context('When upload fail', () => {
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

                httpRequest = () => {
                    throw new Error('error test');
                };

                imageMock = {
                    buffer: pngBufferMock,
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

            it('should throw error', async () => {
                process.env.NODE_ENV = 'production';
                try {
                    await imageStorageClient.upload(imageMock);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('error test');
                    expect(err.code).to.be.equal(500);
                }
                process.env.NODE_ENV = 'test';
            });

            it('should fallback to the mocked upload response outside production mode', async () => {
                process.env.NODE_ENV = 'test';

                const imageUp = await imageStorageClient.upload(imageMock);

                expect(imageUp).to.have.property('id');
                expect(imageUp).to.have.property('title');
                expect(imageUp).to.have.property('link');
                expect(imageUp).to.have.property('uploadDate');
                expect(imageUp).to.have.property('request');
                process.env.NODE_ENV = 'test';
            });
        });
    });
});

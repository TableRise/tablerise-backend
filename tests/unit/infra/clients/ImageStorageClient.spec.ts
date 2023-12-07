import sinon from 'sinon';
import ImageStorageClient from 'src/infra/clients/ImageStorageClient';
import { FileObject } from 'src/types/File';

describe('Infra :: Clients :: ImageStorageClient', () => {
    let imageStorageClient: ImageStorageClient,
    configs: any,
    httpRequest: any,
    imageMock: FileObject;
    
    const logger = (): void => {};

    context('#upload', () => {
        const bufferMock = Buffer.from('', 'binary');

        beforeEach(() => {
            configs = {
                api: {
                    imgur: {
                        baseUrl: '',
                        authorization: '',
                        endpoints: {
                            postImage: ''
                        }
                    }
                }
            };

            httpRequest = () => ({ data: 'upload test' });

            imageMock = {
                buffer: bufferMock,
                mimetype: 'image/png',
                originalname: 'test.png',
                fieldname: 'file',
                encoding: 'utf-8',
                size: 154
            }

            imageStorageClient = new ImageStorageClient({
                logger,
                configs,
                httpRequest
            });

            sinon.spy(Buffer, 'from');
        });

        it('should correctly upload the picture', async () => {
            process.env.NODE_ENV = 'production';
            const imageUp = await imageStorageClient.upload(imageMock);
            expect(imageUp).to.be.deep.equal('upload test');
            expect(Buffer.from).to.have.been.calledWith(bufferMock, 'base64');
            process.env.NODE_ENV = 'develop';
        })
    });
});

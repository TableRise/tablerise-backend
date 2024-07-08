import sinon from 'sinon';
import { NextFunction, Request, Response } from 'express';
import ImageMiddleware from 'src/interface/common/middlewares/ImageMiddleware';
import { Readable } from 'stream';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';

describe('Interface :: Users :: Middlewares :: ImageMiddleware', () => {
    let imageMiddleware: ImageMiddleware;

    const logger = (): any => {};
    const bufferMock = Buffer.from('', 'binary');

    context('When multer method returns multer instance', () => {
        before(() => {
            imageMiddleware = new ImageMiddleware({ logger });
        });

        it('should return multer instance', () => {
            const multerInstance = imageMiddleware.multer();
            expect(multerInstance).to.have.property('fileFilter');
            expect(multerInstance).to.have.property('limits');
            expect(multerInstance).to.have.property('storage');
        });
    });

    context('When an image is passed througth requests', () => {
        const request = {} as Request;
        const response = {} as Response;
        const next = sinon.spy(() => {}) as NextFunction;

        response.status = sinon.spy(() => response);
        response.json = sinon.spy(() => response);

        before(() => {
            imageMiddleware = new ImageMiddleware({ logger });
        });

        it('should call next', async () => {
            request.file = {
                buffer: bufferMock,
                mimetype: 'image/png',
                originalname: 'test.png',
                fieldname: 'file',
                encoding: 'utf-8',
                size: 154,
                stream: '' as unknown as Readable,
                destination: '',
                filename: '',
                path: '',
            };

            imageMiddleware.fileType(request, response, next);

            expect(next).to.have.been.called();
        });

        it('should throw an error - invalid extension', async () => {
            try {
                request.file = {
                    buffer: bufferMock,
                    mimetype: 'application/json',
                    originalname: 'test.json',
                    fieldname: 'file',
                    encoding: 'utf-8',
                    size: 154,
                    stream: '' as unknown as Readable,
                    destination: '',
                    filename: '',
                    path: '',
                };

                imageMiddleware.fileType(request, response, next);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).to.be.equal(
                    'File extension is not allowed, valid extensions are: [png, jpg, jpeg]'
                );
                expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                expect(err.name).to.be.equal('BadRequest');
            }
        });

        it('should call next - without a file', async () => {
            request.file = undefined;
            imageMiddleware.fileType(request, response, next);
            expect(next).to.have.been.called();
        });
    });
});

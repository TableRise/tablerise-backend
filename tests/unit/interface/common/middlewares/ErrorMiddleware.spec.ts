import { NextFunction, Request, Response } from 'express';
import sinon from 'sinon';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import ErrorMiddleware from 'src/interface/common/middlewares/ErrorMiddleware';

describe('Interface :: Common :: Middlewares :: ErrorMiddleware', () => {
    context('When an error is throwed', () => {
        const request = {} as Request;
        const response = {} as Response;
        const next = sinon.spy(() => {}) as NextFunction;

        response.status = sinon.spy(() => response);
        response.json = sinon.spy(() => response);
        response.send = sinon.spy(() => response);

        it('should return error 500 - internal', async () => {
            const error = new Error('Internal');
            ErrorMiddleware(error, request, response, next);

            expect(response.status).to.have.been.calledWith(500);
            expect(response.json).to.have.not.been.called();
            expect(response.send).to.have.been.calledWith('Internal');
        });

        it('should return error 422 - business', async () => {
            const error = new HttpRequestErrors({
                message: 'Prop is incorrect',
                name: 'Schema error',
                code: HttpStatusCode.UNPROCESSABLE_ENTITY,
                details: [
                    {
                        attribute: 'prop',
                        path: 'obj.prop',
                        reason: 'prop is undefined',
                    },
                ],
            });

            ErrorMiddleware(error, request, response, next);

            expect(response.status).to.have.been.calledWith(422);
            expect(response.json).to.have.been.called();
        });

        it('should return error 400 - bad request and others', async () => {
            try {
                HttpRequestErrors.throwError('2fa-no-active');
            } catch (error) {
                const err = error as HttpRequestErrors;
                ErrorMiddleware(err, request, response, next);

                expect(response.status).to.have.been.calledWith(422);
                expect(response.json).to.have.been.called();
            }
        });
    });
});

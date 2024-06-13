import { NextFunction, Request, Response } from 'express';
import sinon from 'sinon';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import AccessHeadersMiddleware from 'src/interface/common/middlewares/AccessHeadersMiddleware';

describe('Interface :: Common :: Middlewares :: AccessHeadersMiddleware', () => {
    context('When a request is made to the server', () => {
        const request = {} as Request;
        const response = {} as Response;
        const next = sinon.spy(() => {}) as NextFunction;

        it('should valid if acess_key is in header', () => {
            process.env.NODE_ENV = 'production';
            process.env.ACCESS_KEY_SECRET = '123';
            request.headers = { accesskey: '123' };

            AccessHeadersMiddleware(request, response, next);
            expect(next).to.have.been.called();
        });

        it('should valid if acess_key is in header - env not production', () => {
            process.env.NODE_ENV = 'develop';
            process.env.ACCESS_KEY_SECRET = '123';
            request.headers = { accesskey: '123' };

            AccessHeadersMiddleware(request, response, next);
            expect(next).to.have.been.called();
        });

        it('should valid if acess_key is in header - no header', () => {
            process.env.NODE_ENV = 'production';
            process.env.ACCESS_KEY_SECRET = '123';
            request.headers = { accesskey: '' };

            try {
                AccessHeadersMiddleware(request, response, next);
                expect('it should not be here').to.be.equal(false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).to.be.equal('Access key incorrect or missing');
                expect(err.code).to.be.equal(HttpStatusCode.FORBIDDEN);
                expect(err.name).to.be.equal('ForbiddenRequest');
            }

            expect(next).to.have.been.called();
        });

        it('should valid if acess_key is in header - header incorrect', () => {
            process.env.NODE_ENV = 'production';
            process.env.ACCESS_KEY_SECRET = '123';
            request.headers = { accesskey: '456' };

            try {
                AccessHeadersMiddleware(request, response, next);
                expect('it should not be here').to.be.equal(false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).to.be.equal('Access key incorrect or missing');
                expect(err.code).to.be.equal(HttpStatusCode.FORBIDDEN);
                expect(err.name).to.be.equal('ForbiddenRequest');
            }
        });
    });
});

import { NextFunction, Request, Response } from 'express';
import sinon from 'sinon';
import AccessHeadersMiddleware from 'src/interface/common/middlewares/AccessHeadersMiddleware';

describe('Interface :: Common :: Middlewares :: AccessHeadersMiddleware', () => {
    context('When a request is made to the server', () => {
        const request = {} as Request;
        const response = {} as Response;
        const next = sinon.spy(() => {}) as NextFunction;

        it('should valid if acess_key is in header', () => {
            process.env.NODE_ENV = 'production';
            process.env.ACCESS_KEY_SECRET = '123';
            request.headers = { access_key: '123' };

            AccessHeadersMiddleware(request, response, next);
            expect(next).to.have.been.called();
        });

        it('should valid if acess_key is in header - env not production', () => {
            process.env.NODE_ENV = 'develop';
            process.env.ACCESS_KEY_SECRET = '123';
            request.headers = { access_key: '123' };

            AccessHeadersMiddleware(request, response, next);
            expect(next).to.have.been.called();
        });

        it('should valid if acess_key is in header - no header', () => {
            process.env.NODE_ENV = 'develop';
            process.env.ACCESS_KEY_SECRET = '123';
            request.headers = { access_key: '' };

            AccessHeadersMiddleware(request, response, next);
            expect(next).to.have.been.called();
        });

        it('should valid if acess_key is in header - header incorrect', () => {
            process.env.NODE_ENV = 'develop';
            process.env.ACCESS_KEY_SECRET = '123';
            request.headers = { access_key: '456' };

            AccessHeadersMiddleware(request, response, next);
            expect(next).to.have.been.called();
        });
    });
});

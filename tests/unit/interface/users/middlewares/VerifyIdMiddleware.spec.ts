import { NextFunction, Request, Response } from 'express';
import sinon from 'sinon';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import VerifyIdMiddleware from 'src/interface/users/middlewares/VerifyIdMiddleware';

describe('Interface :: Users :: Middlewares :: VerifyIdMiddleware', () => {
    let verifyIdMiddleware: typeof VerifyIdMiddleware;

    context('When the id passed throught params is validated in middleware', () => {
        const request = {} as Request;
        const response = {} as Response;
        const next = sinon.spy(() => {}) as NextFunction;

        response.status = sinon.spy(() => response);
        response.json = sinon.spy(() => response);

        context('When the id is valid', () => {
            it('should call next', () => {
                verifyIdMiddleware(request, response, next);
                expect(next).to.have.been.called();
            });
        });

        context('When the id is invalid', () => {
            it('should throw error', () => {
                try {
                    verifyIdMiddleware(request, response, next);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('The parameter id is invalid');
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                    expect(err.name).to.be.equal('BadRequest');
                }
            });
        });
    });
});

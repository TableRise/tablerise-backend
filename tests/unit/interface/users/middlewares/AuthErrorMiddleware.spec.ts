import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import AuthErrorMiddleware from 'src/interface/users/middlewares/AuthErrorMiddleware';

describe('Interface :: Users :: Middlewares :: AuthErrorMiddleware', () => {
    context('When external auth goes wrong', () => {
        const request = {} as Request;
        const response = {} as Response;

        response.status = sinon.spy(() => response);
        response.json = sinon.spy(() => response);

        it('should throw an error in response', async () => {
            AuthErrorMiddleware(request, response);

            expect(response.status).to.have.been.calledWith(HttpStatusCode.UNAUTHORIZED);
            expect(response.json).to.have.been.calledWith({
                name: 'Unauthorized',
                message: 'Some error ocurred during authentication',
            });
        });
    });
});

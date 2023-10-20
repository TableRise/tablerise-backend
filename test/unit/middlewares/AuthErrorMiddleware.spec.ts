import { Request, Response } from 'express';
import AuthErrorMiddleware from 'src/interface/users/middlewares/AuthErrorMiddleware';
import { HttpStatusCode } from 'src/infra/helpers/HttpStatusCode';

describe('Middlewares :: AuthErrorMiddleware', () => {
    describe('When called', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});
        });

        it('should throw an error for a failed try to authenticate with external provider', () => {
            AuthErrorMiddleware(request, response);

            expect(response.status).toHaveBeenCalledWith(HttpStatusCode.UNAUTHORIZED);
            expect(response.json).toHaveBeenCalledWith({
                name: 'Unauthorized',
                message: 'Some error ocurred during authentication',
            });
        });
    });
});

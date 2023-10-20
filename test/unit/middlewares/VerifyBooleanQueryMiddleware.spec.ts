import { Request, Response, NextFunction } from 'express';
import VerifyBooleanQueryMiddleware from 'src/interface/common/middlewares/VerifyBooleanQueryMiddleware';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';

describe('Middlewares :: VerifyBooleanQueryMiddleware', () => {
    describe('When a request is made with the query availability', () => {
        const request = {} as Request;
        const response = {} as Response;
        let next: NextFunction;

        beforeEach(() => {
            next = jest.fn();
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should be successfull if is a valid query', () => {
            request.query = { availability: 'true' };
            VerifyBooleanQueryMiddleware(request, response, next);

            expect(next).toHaveBeenCalled();
        });

        it('should fail if is a invalid query', () => {
            try {
                request.query = { availability: 'invalid' };
                VerifyBooleanQueryMiddleware(request, response, next);
            } catch (error) {
                const err = error as HttpRequestErrors;

                expect(err.message).toBe('The query is invalid');
                expect(err.code).toBe(400);
                expect(err.name).toBe('Invalid Entry');
                expect(next).toHaveBeenCalledTimes(0);
            }
        });
    });
});

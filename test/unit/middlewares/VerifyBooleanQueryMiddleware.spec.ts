import { Request, Response, NextFunction } from 'express';
import VerifyBooleanQueryMiddleware from 'src/middlewares/VerifyBooleanQueryMiddleware';

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
                const err = error as Error;

                expect(err.message).toBe('The query is invalid');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('Invalid Entry');
                expect(next).toHaveBeenCalledTimes(0);
            }
        });
    });
});

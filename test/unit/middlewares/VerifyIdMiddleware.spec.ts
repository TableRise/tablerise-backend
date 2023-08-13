import { Request, Response, NextFunction } from 'express';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Connections from 'src/database/DatabaseConnection';

describe('Middlewares :: VerifyIdMiddleware', () => {
    describe('When a request is made with the parameter _id', () => {
        const request = {} as Request;
        const response = {} as Response;
        let next: NextFunction;

        beforeEach(() => {
            next = jest.fn();
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should be successfull if is a valid mongo id', () => {
            request.params = { id: generateNewMongoID() };
            VerifyIdMiddleware(request, response, next);

            expect(next).toHaveBeenCalled();
        });

        it('should fail if is a valid mongo id', () => {
            try {
                request.params = { id: 'invalid' };
                VerifyIdMiddleware(request, response, next);
            } catch (error) {
                const err = error as Error;

                expect(err.message).toBe('The parameter id is invalid');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('Invalid Entry');
                expect(next).toHaveBeenCalledTimes(0);
            }
        });
    });
});

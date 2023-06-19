import { Request, Response, NextFunction } from 'express';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

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
    })

    it('should be successfull if is a valid mongo id', () => {
      request.params = { _id: generateNewMongoID() };
      VerifyIdMiddleware(request, response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should fail if is a valid mongo id', () => {
      try {
        request.params = { _id: 'invalid' };
        VerifyIdMiddleware(request, response, next);
      } catch (error) {
        const err = error as Error;

        expect(err.message).toBe('The parameter id is invalid');
        expect(next).toHaveBeenCalledTimes(0);
      }
    });
  });
});

import { NextFunction, Request, Response } from 'express';
import ErrorMiddleware from 'src/middlewares/ErrorMiddleware';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';

describe('Middlewares :: ErrorMiddleware', () => {
  describe('When error is throwed by request', () => {
    const request = {} as Request;
    const response = {} as Response;
    const error = {} as Error;
    const next = jest.fn().mockReturnValue({}) as NextFunction;

    const ZOD_ERROR_SYSTEM_NAME = {
      name: 'ValidationError',
      message: [
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'undefined',
          path: [
            'name'
          ],
          message: 'Required'
        }
      ]
    }

    beforeAll(() => {
      response.status = jest.fn().mockReturnValue(response);
      response.json = jest.fn().mockReturnValue({});
      error.message = JSON.stringify(ZOD_ERROR_SYSTEM_NAME.message);
      error.stack = '422';
      error.name = 'ValidationError';
    });

    it('should the error message be returned and http status error code throwed', () => {
      ErrorMiddleware(error, request, response, next);

      expect(response.status).toHaveBeenCalledWith(HttpStatusCode.UNPROCESSABLE_ENTITY);
      expect(response.json).toHaveBeenCalledWith({
        name: error.name,
        message: error.message
      });
    });
  });

  describe('When error is throwed by internal', () => {
    const request = {} as Request;
    const response = {} as Response;
    const error = {} as Error;
    const next = jest.fn().mockReturnValue({}) as NextFunction;

    beforeAll(() => {
      response.status = jest.fn().mockReturnValue(response);
      response.json = jest.fn().mockReturnValue({});
      response.send = jest.fn().mockReturnValue('');
      error.message = 'Internal Error';
      error.stack = '';
      error.name = 'Internal Error';
    });

    it('should the error message be returned and internal error code throwed', () => {
      ErrorMiddleware(error, request, response, next);

      expect(response.status).toHaveBeenCalledWith(HttpStatusCode.INTERNAL_SERVER);
      expect(response.send).toHaveBeenCalledWith('Internal Error');
    });
  });
});

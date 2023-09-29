import { NextFunction, Request, Response } from 'express';
import ErrorMiddleware from 'src/middlewares/ErrorMiddleware';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';

describe('Middlewares :: ErrorMiddleware', () => {
    describe('When error is throwed by request', () => {
        const request = {} as Request;
        const response = {} as Response;
        const error = new HttpRequestErrors({
            message: 'Schema error',
            code: 422,
            name: 'ValidationError',
            details: [{ attribute: 'name', path: 'required', reason: 'missing' }],
        });
        const next = jest.fn().mockReturnValue({}) as NextFunction;

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});
            response.send = jest.fn().mockReturnValue('');
        });

        afterAll(() => jest.clearAllMocks());

        it('should the error message be returned and http status error code throwed', () => {
            ErrorMiddleware(error, request, response, next);

            expect(response.status).toHaveBeenCalledWith(HttpStatusCode.UNPROCESSABLE_ENTITY);
            expect(response.json).toHaveBeenCalledWith({
                name: error.name,
                message: error.message,
                code: error.code,
                details: error.details,
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
            response.send = jest.fn().mockReturnValue('');
            error.message = 'Internal Error';
            error.stack = '';
            error.name = 'Internal Error';
        });

        afterAll(() => jest.clearAllMocks());

        it('should the error message be returned and internal error code throwed', () => {
            ErrorMiddleware(error, request, response, next);

            expect(response.status).toHaveBeenCalledWith(HttpStatusCode.INTERNAL_SERVER);
            expect(response.send).toHaveBeenCalledWith('Internal Error');
        });
    });
});

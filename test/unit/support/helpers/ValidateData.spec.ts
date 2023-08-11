import { z } from 'zod';
import ValidateData from 'src/support/helpers/ValidateData';
import mocks from 'src/support/mocks';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Race } from 'src/schemas/racesValidationSchema';
import { errorMessage } from 'src/support/helpers/errorMessage';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { System } from 'src/schemas/systemValidationSchema';

const logger = require('@tablerise/dynamic-logger');

describe('Helpers :: ValidateData', () => {
    describe('when a zod validation is successfull', () => {
        it('should not throw any error', () => {
            try {
                const testZodSchema = z.object({
                    value: z.number().min(5),
                });

                const testObject = { value: 10 };
                const validate = new ValidateData(logger);
                validate.entry(testZodSchema, testObject);
                expect(true).toBe(true);
            } catch (error) {
                expect(error).toBeUndefined();
            }
        });
    });

    describe('when a zod validation fail', () => {
        const zodErrorObject = [
            {
                code: 'invalid_type',
                expected: 'number',
                message: 'Required',
                path: ['value'],
                received: 'undefined',
            },
        ];

        it('should throw an error', () => {
            try {
                const testZodSchema = z.object({
                    value: z.number().min(5),
                });

                const testObject = { noNumber: '10' };
                const validate = new ValidateData(logger);
                validate.entry(testZodSchema, testObject);
                expect(true).toBe(false);
            } catch (error) {
                const zodError = error as Error;
                expect(zodError).toHaveProperty('message');
                expect(zodError).toHaveProperty('stack');
                expect(zodError).toHaveProperty('name');
                expect(JSON.parse(zodError.message)).toStrictEqual(zodErrorObject);
                expect(zodError.stack).toBe('422');
                expect(zodError.name).toBe('ValidationError');
            }
        });
    });

    describe('when validate.response fail', () => {
        const response = null;
        it('should throw an error', () => {
            try {
                const validate = new ValidateData(logger);
                const testResponse = validate.response(response, errorMessage.notFound.race);
                expect(testResponse).toBe(null);
            } catch (error) {
                const notFoundError = error as Error;
                expect(notFoundError).toHaveProperty('message');
                expect(notFoundError).toHaveProperty('stack');
                expect(notFoundError).toHaveProperty('name');
                expect(notFoundError.message).toBe(`NotFound a race with provided ID`);
                expect(notFoundError.stack).toBe('404');
                expect(notFoundError.name).toBe('NotFound');
            }
        });
    });

    describe('when validate.response is sucessfull', () => {
        const response = mocks.race.instance.en as Internacional<Race>;
        it('should not throw a Not Found error', () => {
            try {
                const validate = new ValidateData(logger);
                const testResponse = validate.response(response, errorMessage.notFound.race);
                expect(testResponse).toStrictEqual(response);
            } catch (error) {
                expect(error).toBeUndefined();
            }
        });
    });

    describe('when validate.active fail', () => {
        const response = { ...(mocks.race.instance.en as Internacional<Race>), active: true };
        it('should throw a an error', () => {
            try {
                const validate = new ValidateData(logger);
                validate.active(response.active, errorMessage.badRequest.default.payloadActive);
            } catch (error) {
                const notFoundError = error as Error;
                expect(notFoundError).toHaveProperty('message');
                expect(notFoundError).toHaveProperty('stack');
                expect(notFoundError).toHaveProperty('name');
                expect(notFoundError.message).toBe(`Not possible to change availability through this route`);
                expect(notFoundError.stack).toBe('400');
                expect(notFoundError.name).toBe('BadRequest');
            }
        });
    });

    describe('when validate.active is sucessfull', () => {
        const response = { ...(mocks.race.instance.en as Internacional<Race>), active: false };
        it('should not throw an error', () => {
            try {
                const validate = new ValidateData(logger);
                validate.active(response.active, errorMessage.badRequest.default.payloadActive);
            } catch (error) {
                expect(error).toBeUndefined();
            }
        });
    });

    describe('when validate.systemResponse fail', () => {
        const response = null;
        it('should throw an error', () => {
            try {
                const validate = new ValidateData(logger);
                validate.systemResponse(response, errorMessage.notFound.system);
            } catch (error) {
                const notFoundError = error as Error;
                expect(notFoundError).toHaveProperty('message');
                expect(notFoundError).toHaveProperty('stack');
                expect(notFoundError).toHaveProperty('name');
                expect(notFoundError.message).toBe(`NotFound a system with provided ID`);
                expect(notFoundError.stack).toBe('404');
                expect(notFoundError.name).toBe('NotFound');
            }
        });
    });

    describe('when validate.systemResponse is sucessfull', () => {
        const response = mocks.system.instance as System;
        it('should not throw a Not Found error', () => {
            try {
                const validate = new ValidateData(logger);
                const testResponse = validate.systemResponse(response, errorMessage.notFound.race);
                expect(testResponse).toStrictEqual(response);
            } catch (error) {
                expect(error).toBeUndefined();
            }
        });
    });

    describe('when validate.systemActive fail', () => {
        const response = { ...(mocks.system.instance as System), active: true };
        it('should throw a an error', () => {
            try {
                const validate = new ValidateData(logger);
                validate.systemActive(
                    response.active,
                    HttpStatusCode.BAD_REQUEST,
                    errorMessage.badRequest.system.responseActive(response.active)
                );
                expect(validate.systemActive).toThrow(Error);
            } catch (error) {
                const notFoundError = error as Error;
                expect(notFoundError).toHaveProperty('message');
                expect(notFoundError).toHaveProperty('stack');
                expect(notFoundError).toHaveProperty('name');
                expect(notFoundError.message).toBe('System already active');
                expect(notFoundError.stack).toBe('400');
                expect(notFoundError.name).toBe('BadRequest');
            }
        });
    });

    describe('when validate.systemActive is sucessfull', () => {
        const response = { ...(mocks.race.instance.en as Internacional<Race>), active: false };
        it('should not throw an error', () => {
            const validate = new ValidateData(logger);
            validate.systemActive(
                response.active,
                HttpStatusCode.BAD_REQUEST,
                errorMessage.badRequest.system.responseActive(response.active)
            );
            expect(validate.systemActive).not.toThrow(Error);
        });
    });

    describe('when validate.systemQuery fail', () => {
        const entityQuery = '';
        it('should throw a an error', () => {
            try {
                const validate = new ValidateData(logger);
                validate.systemEntityQuery(entityQuery, errorMessage.unprocessableEntity);
                expect(validate.systemEntityQuery).toThrow(Error);
            } catch (error) {
                const notFoundError = error as Error;
                expect(notFoundError).toHaveProperty('message');
                expect(notFoundError).toHaveProperty('stack');
                expect(notFoundError).toHaveProperty('name');
                expect(notFoundError.message).toBe(`An entity name is required`);
                expect(notFoundError.stack).toBe('422');
                expect(notFoundError.name).toBe('ValidationError');
            }
        });
    });

    describe('when validate.systemQuery is sucessfull', () => {
        const entityQuery = 'sucessfull';
        it('should not throw an error', () => {
            try {
                const validate = new ValidateData(logger);
                validate.systemEntityQuery(entityQuery, errorMessage.unprocessableEntity);
            } catch (error) {
                expect(error).toBeUndefined();
            }
        });
    });
});

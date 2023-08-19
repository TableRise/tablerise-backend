import { z } from 'zod';
import ValidateData from 'src/support/helpers/ValidateData';
import mocks from 'src/support/mocks';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Race } from 'src/schemas/racesValidationSchema';
import { ErrorMessage } from 'src/support/helpers/errorMessage';
import getErrorName from 'src/support/helpers/getErrorName';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';

const logger = require('@tablerise/dynamic-logger');

describe('Helpers :: ValidateData', () => {
    const testToThrowError = (err: Error, errMessage: string, code: number): void => {
        expect(err).toHaveProperty('message');
        expect(err).toHaveProperty('stack');
        expect(err).toHaveProperty('name');
        expect(err.message).toStrictEqual(errMessage);
        expect(err.stack).toBe(code.toString());
        expect(err.name).toBe(getErrorName(code));
    };

    describe('when a zod validate.entry is successfull', () => {
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

    describe('when a zod validate.entry fail', () => {
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
                testToThrowError(zodError, zodError.message, HttpStatusCode.UNPROCESSABLE_ENTITY);
                expect(JSON.parse(zodError.message)).toStrictEqual(zodErrorObject);
            }
        });
    });

    // describe('when validate.response fail', () => {
    //     const response = null;
    //     it('should throw an error', () => {
    //         try {
    //             const validate = new ValidateData(logger);
    //             validate.response(response, ErrorMessage.NOT_FOUND_BY_ID);
    //         } catch (error) {
    //             const notFoundError = error as Error;
    //             testToThrowError(notFoundError, ErrorMessage.NOT_FOUND_BY_ID, HttpStatusCode.NOT_FOUND);
    //         }
    //     });
    // });

    // describe('when validate.response is sucessfull', () => {
    //     const response = mocks.race.instance.en as Internacional<Race>;
    //     it('should not throw a Not Found error', () => {
    //         try {
    //             const validate = new ValidateData(logger);
    //             validate.response(response, ErrorMessage.NOT_FOUND_BY_ID);
    //         } catch (error) {
    //             expect(error).toBeUndefined();
    //         }
    //     });
    // });

    describe('when validate.existance fail', () => {
        const errorCondition = true;
        it('should throw a an error', () => {
            try {
                const validate = new ValidateData(logger);
                validate.existance(errorCondition, ErrorMessage.BAD_REQUEST);
                expect(validate.existance).toThrow(Error);
            } catch (error) {
                const notFoundError = error as Error;
                testToThrowError(notFoundError, ErrorMessage.BAD_REQUEST, HttpStatusCode.BAD_REQUEST);
            }
        });
    });

    describe('when validate.existance is sucessfull', () => {
        const errorCondition = false;
        it('should not throw an error', () => {
            try {
                const validate = new ValidateData(logger);
                validate.existance(errorCondition, ErrorMessage.BAD_REQUEST);
            } catch (error) {
                expect(error).toBeUndefined();
            }
        });
    });
});

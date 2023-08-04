import { z } from 'zod';
import ValidateData from 'src/support/helpers/ValidateData';
import mocks from 'src/support/mocks';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Race } from 'src/schemas/racesValidationSchema';

describe('Helpers :: ValidateData', () => {
    describe('when a zod validation is successfull', () => {
        it('should not throw any error', () => {
            try {
                const testZodSchema = z.object({
                    value: z.number().min(5),
                });

                const testObject = { value: 10 };

                new ValidateData().validatorEntry(testZodSchema, testObject);
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

                new ValidateData().validatorEntry(testZodSchema, testObject);
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

    describe('when response is not valid', () => {
        const response = null;
        const className = 'Race';
        it('should throw a Not Found error', () => {
            try {
                const test = new ValidateData();
                const testResponse = test.validatorResponse(response, className);
                expect(testResponse).toBe(null);
            } catch (error) {
                const notFoundError = error as Error;
                expect(notFoundError).toHaveProperty('message');
                expect(notFoundError).toHaveProperty('stack');
                expect(notFoundError).toHaveProperty('name');
                expect(notFoundError.message).toBe(`NotFound a ${className} with provided ID`);
                expect(notFoundError.stack).toBe('404');
                expect(notFoundError.name).toBe('NotFound');
            }
        });
    });

    describe('when response valid', () => {
        const response = mocks.race.instance.en as Internacional<Race>;
        const className = 'Race';
        it('should not throw a Not Found error', () => {
            try {
                const test = new ValidateData();
                const testResponse = test.validatorResponse(response, className);
                expect(testResponse).toStrictEqual(response);
            } catch (error) {
                expect(error).toBeUndefined();
            }
        });
    });
});

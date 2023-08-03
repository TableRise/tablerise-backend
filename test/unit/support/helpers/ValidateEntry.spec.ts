import { z } from 'zod';
import ValidateEntry from 'src/support/helpers/ValidateData';

describe('Helpers :: ValidateEntry', () => {
    describe('when a zod validation is successfull', () => {
        it('should not throw any error', () => {
            try {
                const testZodSchema = z.object({
                    value: z.number().min(5),
                });

                const testObject = { value: 10 };

                new ValidateEntry().validator(testZodSchema, testObject);
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

        it('should not throw any error', () => {
            try {
                const testZodSchema = z.object({
                    value: z.number().min(5),
                });

                const testObject = { noNumber: '10' };

                new ValidateEntry().validator(testZodSchema, testObject);
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
});

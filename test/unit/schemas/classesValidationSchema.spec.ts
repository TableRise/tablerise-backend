import classZodSchema, { Class } from 'src/schemas/classesValidationSchema';
import mocks from 'src/support/mocks';

describe('Schemas :: classesValidationSchema', () => {
    describe('When the zod validation is called with the correct data', () => {
        it('should be successfull', () => {
            const schemaValidation = classZodSchema.safeParse(mocks.class.instance.en);
            expect(schemaValidation.success).toBe(true);
        });
    });

    describe('When the zod validation is called with the incorrect data', () => {
        it('should fail', () => {
            const { name: _, ...classWithoutName } = mocks.class.instance.en as Class;

            const schemaValidation = classZodSchema.safeParse(classWithoutName);
            expect(schemaValidation.success).toBe(false);
        });
    });
});

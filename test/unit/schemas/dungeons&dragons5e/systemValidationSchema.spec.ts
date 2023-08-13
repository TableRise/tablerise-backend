import systemZodSchema, { System } from 'src/schemas/dungeons&dragons5e/systemValidationSchema';
import mocks from 'src/support/mocks/dungeons&dragons5e';

describe('Schemas :: SystemValidationSchema', () => {
    describe('When the zod validation is called with the correct data', () => {
        it('should be successfull', () => {
            const schemaValidation = systemZodSchema.safeParse(mocks.system.instance);
            expect(schemaValidation.success).toBe(true);
        });
    });

    describe('When the zod validation is called with the incorrect data', () => {
        it('should fail', () => {
            const { name: _, ...systemMockWithoutName } = mocks.system.instance as System;

            const schemaValidation = systemZodSchema.safeParse(systemMockWithoutName);
            expect(schemaValidation.success).toBe(false);
        });
    });
});

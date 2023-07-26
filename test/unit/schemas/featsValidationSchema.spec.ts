import featZodSchema, { Feat } from 'src/schemas/featsValidationSchema';
import mocks from 'src/support/mocks';

describe('Schemas :: FeatsValidationSchema', () => {
    describe('When the zod validation is called with the correct data', () => {
        it('should be successfull', () => {
            const schemaValidation = featZodSchema.safeParse(mocks.feat.instance.en);
            expect(schemaValidation.success).toBe(true);
        });
    });

    describe('When the zod validation is called with the incorrect data', () => {
        it('should fail', () => {
            const { name: _, ...featWithoutName } = mocks.feat.instance.en as Feat;

            const schemaValidation = featZodSchema.safeParse(featWithoutName);
            expect(schemaValidation.success).toBe(false);
        });
    });
});

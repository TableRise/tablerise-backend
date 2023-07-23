import magicItemZodSchema, { MagicItem } from 'src/schemas/magicItemsValidationSchema';
import mocks from 'src/support/mocks';

describe('Schemas :: MagicItemsValidationSchema', () => {
    describe('When the zod validation is called with the correct data', () => {
        it('should be successfull', () => {
            const schemaValidation = magicItemZodSchema.safeParse(mocks.magicItems.instance.en);
            expect(schemaValidation.success).toBe(true);
        });
    });

    describe('When the zod validation is called with the incorrect data', () => {
        it('should fail', () => {
            const { name: _, ...magicItemMockWithoutName } = mocks.magicItems.instance.en as MagicItem;

            const schemaValidation = magicItemZodSchema.safeParse(magicItemMockWithoutName);
            expect(schemaValidation.success).toBe(false);
        });
    });
});

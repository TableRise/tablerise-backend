import itemsZodSchema, { Item } from 'src/schemas/dungeons&dragons5e/itemsValidationSchema';
import mocks from 'src/support/mocks/dungeons&dragons5e';

describe('Schemas :: itemsValidationSchema', () => {
    describe('When the zod validation is called with the correct data', () => {
        it('should be successfull', () => {
            const schemaValidation = itemsZodSchema.safeParse(mocks.item.instance.en);
            expect(schemaValidation.success).toBe(true);
        });
    });

    describe('When the zod validation is called with the incorrect data', () => {
        it('should fail', () => {
            const { name: _, ...godMockWithoutName } = mocks.item.instance.en as Item;

            const schemaValidation = itemsZodSchema.safeParse(godMockWithoutName);
            expect(schemaValidation.success).toBe(false);
        });
    });
});

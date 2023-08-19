import armorZodSchema, { Armor } from 'src/schemas/dungeons&dragons5e/armorsValidationSchema';
import mocks from 'src/support/mocks/dungeons&dragons5e';

describe('Schemas :: armorsValidationSchema', () => {
    describe('When the zod validation is called with the correct data', () => {
        it('should be successfull', () => {
            const schemaValidation = armorZodSchema.safeParse(mocks.armor.instance.en);
            expect(schemaValidation.success).toBe(true);
        });
    });

    describe('When the zod validation is called with the incorrect data', () => {
        it('should fail', () => {
            const { name: _, ...armorWithoutName } = mocks.armor.instance.en as Armor;

            const schemaValidation = armorZodSchema.safeParse(armorWithoutName);
            expect(schemaValidation.success).toBe(false);
        });
    });
});

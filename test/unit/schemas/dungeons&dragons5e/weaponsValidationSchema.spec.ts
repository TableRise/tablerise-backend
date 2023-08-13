import weaponZodSchema, { Weapon } from 'src/schemas/dungeons&dragons5e/weaponsValidationSchema';
import mocks from 'src/support/mocks/dungeons&dragons5e';

describe('Schemas :: weaponsValidationSchema', () => {
    describe('When the zod validation is called with the correct data', () => {
        it('should be successfull', () => {
            const schemaValidation = weaponZodSchema.safeParse(mocks.weapon.instance.en);
            expect(schemaValidation.success).toBe(true);
        });
    });

    describe('When the zod validation is called with the incorrect data', () => {
        it('should fail', () => {
            const { name: _, ...weaponWithoutName } = mocks.weapon.instance.en as Weapon;

            const schemaValidation = weaponZodSchema.safeParse(weaponWithoutName);
            expect(schemaValidation.success).toBe(false);
        });
    });
});

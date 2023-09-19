import schema from 'src/schemas';
import { Weapon } from 'src/schemas/dungeons&dragons5e/weaponsValidationSchema';
import mock from 'src/support/mocks/dungeons&dragons5e';

describe('Schemas :: DungeonsAndDragons5e :: WeaponsValidationSchema', () => {
    const weapon = mock.weapon.instance.en as Weapon;

    describe('When data is correct', () => {
        it('should not return errors', () => {
            const result = schema['dungeons&dragons5e'].weaponZod.safeParse(weapon);
            expect(result.success).toBe(true);
        });
    });

    describe('When data is incorrect', () => {
        it('should return errors', () => {
            const { name: _, ...weaponWithoutCost } = weapon;
            const result = schema['dungeons&dragons5e'].weaponZod.safeParse(weaponWithoutCost);
            expect(result.success).toBe(false);
        });
    });
});

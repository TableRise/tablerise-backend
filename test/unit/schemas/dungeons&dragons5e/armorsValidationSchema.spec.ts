import schema from 'src/schemas';
import { Armor } from 'src/schemas/dungeons&dragons5e/armorsValidationSchema';
import mock from 'src/support/mocks/dungeons&dragons5e';

describe('Schemas :: DungeonsAndDragons5e :: ArmorsValidationSchema', () => {
    const armor = mock.armor.instance.en as Armor;

    describe('When data is correct', () => {
        it('should not return errors', () => {
            const result = schema['dungeons&dragons5e'].armorZod.safeParse(armor);
            expect(result.success).toBe(true);
        });
    });

    describe('When data is incorrect', () => {
        it('should return errors', () => {
            const { cost: _, ...armorWithoutCost } = armor;
            const result = schema['dungeons&dragons5e'].armorZod.safeParse(armorWithoutCost);
            expect(result.success).toBe(false);
        });
    });
});

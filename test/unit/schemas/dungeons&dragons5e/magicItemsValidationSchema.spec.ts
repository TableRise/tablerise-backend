import schema from 'src/schemas';
import { MagicItem } from 'src/schemas/dungeons&dragons5e/magicItemsValidationSchema';
import mock from 'src/support/mocks/dungeons&dragons5e';

describe('Schemas :: DungeonsAndDragons5e :: ItemsValidationSchema', () => {
    const magicItem = mock.magicItems.instance.en as MagicItem;

    describe('When data is correct', () => {
        it('should not return errors', () => {
            const result = schema['dungeons&dragons5e'].magicItemZod.safeParse(magicItem);
            expect(result.success).toBe(true);
        });
    });

    describe('When data is incorrect', () => {
        it('should return errors', () => {
            const { name: _, ...magicItemWithoutCost } = magicItem;
            const result = schema['dungeons&dragons5e'].magicItemZod.safeParse(magicItemWithoutCost);
            expect(result.success).toBe(false);
        });
    });
});

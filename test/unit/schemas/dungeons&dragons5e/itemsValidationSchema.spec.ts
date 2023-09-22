import schema from 'src/schemas';
import { Item } from 'src/schemas/dungeons&dragons5e/itemsValidationSchema';
import mock from 'src/support/mocks/dungeons&dragons5e';

describe('Schemas :: DungeonsAndDragons5e :: ItemsValidationSchema', () => {
    const item = mock.item.instance.en as Item;

    describe('When data is correct', () => {
        it('should not return errors', () => {
            const result = schema['dungeons&dragons5e'].itemZod.safeParse(item);
            expect(result.success).toBe(true);
        });
    });

    describe('When data is incorrect', () => {
        it('should return errors', () => {
            const { name: _, ...itemWithoutCost } = item;
            const result = schema['dungeons&dragons5e'].itemZod.safeParse(itemWithoutCost);
            expect(result.success).toBe(false);
        });
    });
});

import schema from 'src/schemas';
import { God } from 'src/schemas/dungeons&dragons5e/godsValidationSchema';
import mock from 'src/support/mocks/dungeons&dragons5e';

describe('Schemas :: DungeonsAndDragons5e :: GodsValidationSchema', () => {
    const god = mock.god.instance.en as God;

    describe('When data is correct', () => {
        it('should not return errors', () => {
            const result = schema['dungeons&dragons5e'].godZod.safeParse(god);
            expect(result.success).toBe(true);
        });
    });

    describe('When data is incorrect', () => {
        it('should return errors', () => {
            const { name: _, ...godWithoutCost } = god;
            const result = schema['dungeons&dragons5e'].godZod.safeParse(godWithoutCost);
            expect(result.success).toBe(false);
        });
    });
});

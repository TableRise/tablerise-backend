import schema from 'src/schemas';
import { Feat } from 'src/schemas/dungeons&dragons5e/featsValidationSchema';
import mock from 'src/support/mocks/dungeons&dragons5e';

describe('Schemas :: DungeonsAndDragons5e :: FeatsValidationSchema', () => {
    const feat = mock.feat.instance.en as Feat;

    describe('When data is correct', () => {
        it('should not return errors', () => {
            const result = schema['dungeons&dragons5e'].featZod.safeParse(feat);
            expect(result.success).toBe(true);
        });
    });

    describe('When data is incorrect', () => {
        it('should return errors', () => {
            const { name: _, ...featWithoutCost } = feat;
            const result = schema['dungeons&dragons5e'].featZod.safeParse(featWithoutCost);
            expect(result.success).toBe(false);
        });
    });
});

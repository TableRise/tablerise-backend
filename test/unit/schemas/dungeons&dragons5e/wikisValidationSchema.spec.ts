import schema from 'src/schemas';
import { Wiki } from 'src/schemas/dungeons&dragons5e/wikisValidationSchema';
import mock from 'src/support/mocks/dungeons&dragons5e';

describe('Schemas :: DungeonsAndDragons5e :: WikisValidationSchema', () => {
    const wiki = mock.wiki.instance.en as Wiki;

    describe('When data is correct', () => {
        it('should not return errors', () => {
            const result = schema['dungeons&dragons5e'].wikiZod.safeParse(wiki);
            expect(result.success).toBe(true);
        });
    });

    describe('When data is incorrect', () => {
        it('should return errors', () => {
            const { title: _, ...wikiWithoutCost } = wiki;
            const result = schema['dungeons&dragons5e'].wikiZod.safeParse(wikiWithoutCost);
            expect(result.success).toBe(false);
        });
    });
});

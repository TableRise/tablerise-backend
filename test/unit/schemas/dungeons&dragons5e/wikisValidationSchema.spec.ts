import wikiZodSchema, { Wiki } from 'src/schemas/dungeons&dragons5e/wikisValidationSchema';
import mocks from 'src/support/mocks/dungeons&dragons5e';

describe('Schemas :: wikisValidationSchema', () => {
    describe('When the zod validation is called with the correct data', () => {
        it('should be successfull', () => {
            const schemaValidation = wikiZodSchema.safeParse(mocks.wiki.instance.en);
            expect(schemaValidation.success).toBe(true);
        });
    });

    describe('When the zod validation is called with the incorrect data', () => {
        it('should fail', () => {
            const { title: _, ...wikiWithoutTitle } = mocks.wiki.instance.en as Wiki;
            const schemaValidation = wikiZodSchema.safeParse(wikiWithoutTitle);
            expect(schemaValidation.success).toBe(false);
        });
    });
});

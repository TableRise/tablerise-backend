import spellZodSchema, { Spell } from 'src/schemas/dungeons&dragons5e/spellsValidationSchema';
import mocks from 'src/support/mocks/dungeons&dragons5e';

describe('Schemas :: spellsValidationSchema', () => {
    describe('When the zod validation is called with the correct data', () => {
        it('should be successfull', () => {
            const schemaValidation = spellZodSchema.safeParse(mocks.spell.instance.en);
            expect(schemaValidation.success).toBe(true);
        });
    });

    describe('When the zod validation is called with the incorrect data', () => {
        it('should fail', () => {
            const { name: _, ...spellWithoutName } = mocks.spell.instance.en as Spell;

            const schemaValidation = spellZodSchema.safeParse(spellWithoutName);
            expect(schemaValidation.success).toBe(false);
        });
    });
});

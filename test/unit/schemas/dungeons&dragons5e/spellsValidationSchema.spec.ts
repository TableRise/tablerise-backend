import schema from 'src/schemas';
import { Spell } from 'src/schemas/dungeons&dragons5e/spellsValidationSchema';
import mock from 'src/support/mocks/dungeons&dragons5e';

describe('Schemas :: DungeonsAndDragons5e :: SpellsValidationSchema', () => {
    const spell = mock.spell.instance.en as Spell;

    describe('When data is correct', () => {
        it('should not return errors', () => {
            const result = schema['dungeons&dragons5e'].spellZod.safeParse(spell);
            expect(result.success).toBe(true);
        });
    });

    describe('When data is incorrect', () => {
        it('should return errors', () => {
            const { name: _, ...spellWithoutCost } = spell;
            const result = schema['dungeons&dragons5e'].spellZod.safeParse(spellWithoutCost);
            expect(result.success).toBe(false);
        });
    });
});

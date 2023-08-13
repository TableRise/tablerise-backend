import monsterZodSchema, { Monster } from 'src/schemas/dungeons&dragons5e/monstersValidationSchema';
import mocks from 'src/support/mocks/dungeons&dragons5e';

describe('Schemas :: monstersValidationSchema', () => {
    describe('When the zod validation is called with the correct data', () => {
        it('should be successfull', () => {
            const schemaValidation = monsterZodSchema.safeParse(mocks.monster.instance.en);
            expect(schemaValidation.success).toBe(true);
        });
    });

    describe('When the zod validation is called with the incorrect data', () => {
        it('should fail', () => {
            const { name: _, ...monsterWithoutName } = mocks.monster.instance.en as Monster;
            const schemaValidation = monsterZodSchema.safeParse(monsterWithoutName);
            expect(schemaValidation.success).toBe(false);
        });
    });
});

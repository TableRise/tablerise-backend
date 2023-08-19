import racesZodSchema, { Race } from 'src/schemas/dungeons&dragons5e/racesValidationSchema';
import mocks from 'src/support/mocks/dungeons&dragons5e';

describe('Schemas :: RacesValidationSchema', () => {
    describe('When the zod validation is called with the correct data', () => {
        it('should be successfull', () => {
            const schemaValidation = racesZodSchema.safeParse(mocks.race.instance.en);
            expect(schemaValidation.success).toBe(true);
        });
    });

    describe('When the zod validation is called with the incorrect data', () => {
        it('should fail', () => {
            const { name: _, ...godMockWithoutName } = mocks.race.instance.en as Race;

            const schemaValidation = racesZodSchema.safeParse(godMockWithoutName);
            expect(schemaValidation.success).toBe(false);
        });
    });
});

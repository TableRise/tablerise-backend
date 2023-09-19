import schema from 'src/schemas';
import { Race } from 'src/schemas/dungeons&dragons5e/racesValidationSchema';
import mock from 'src/support/mocks/dungeons&dragons5e';

describe('Schemas :: DungeonsAndDragons5e :: RacesValidationSchema', () => {
    const race = mock.race.instance.en as Race;

    describe('When data is correct', () => {
        it('should not return errors', () => {
            const result = schema['dungeons&dragons5e'].raceZod.safeParse(race);
            expect(result.success).toBe(true);
        });
    });

    describe('When data is incorrect', () => {
        it('should return errors', () => {
            const { name: _, ...raceWithoutCost } = race;
            const result = schema['dungeons&dragons5e'].raceZod.safeParse(raceWithoutCost);
            expect(result.success).toBe(false);
        });
    });
});

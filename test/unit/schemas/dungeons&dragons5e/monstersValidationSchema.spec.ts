import schema from 'src/schemas';
import { Monster } from 'src/schemas/dungeons&dragons5e/monstersValidationSchema';
import mock from 'src/support/mocks/dungeons&dragons5e';

describe('Schemas :: DungeonsAndDragons5e :: MonstersValidationSchema', () => {
    const monster = mock.monster.instance.en as Monster;

    describe('When data is correct', () => {
        it('should not return errors', () => {
            const result = schema['dungeons&dragons5e'].monsterZod.safeParse(monster);
            expect(result.success).toBe(true);
        });
    });

    describe('When data is incorrect', () => {
        it('should return errors', () => {
            const { name: _, ...monsterWithoutCost } = monster;
            const result = schema['dungeons&dragons5e'].monsterZod.safeParse(monsterWithoutCost);
            expect(result.success).toBe(false);
        });
    });
});

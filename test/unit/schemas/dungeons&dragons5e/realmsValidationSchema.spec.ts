import schema from 'src/schemas';
import { Realm } from 'src/schemas/dungeons&dragons5e/realmsValidationSchema';
import mock from 'src/support/mocks/dungeons&dragons5e';

describe('Schemas :: DungeonsAndDragons5e :: RealmsValidationSchema', () => {
    const realm = mock.realm.instance.en as Realm;

    describe('When data is correct', () => {
        it('should not return errors', () => {
            const result = schema['dungeons&dragons5e'].realmZod.safeParse(realm);
            expect(result.success).toBe(true);
        });
    });

    describe('When data is incorrect', () => {
        it('should return errors', () => {
            const { name: _, ...realmWithoutCost } = realm;
            const result = schema['dungeons&dragons5e'].realmZod.safeParse(realmWithoutCost);
            expect(result.success).toBe(false);
        });
    });
});

import realmZodSchema, { Realm } from 'src/schemas/realmsValidationSchema';
import mocks from 'src/support/mocks';

describe('Schemas :: RealmsValidationSchema', () => {
  describe('When the zod validation is called with the correct data', () => {
    it('should be successfull', () => {
      const schemaValidation = realmZodSchema.safeParse(mocks.realm.instance.en);
      expect(schemaValidation.success).toBe(true);
    });
  });

  describe('When the zod validation is called with the incorrect data', () => {
    it('should fail', () => {
      const { name: _, ...realmMockWithoutName } = mocks.realm.instance.en as Realm;

      const schemaValidation = realmZodSchema.safeParse(realmMockWithoutName);
      expect(schemaValidation.success).toBe(false);
    });
  });
});

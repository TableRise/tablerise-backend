import systemZodSchema, { ISystem } from 'src/schemas/systemsValidationSchema';
import mocks from 'src/support/schemas';

describe('Schemas :: SystemValidationSchema', () => {
  describe('When the zod validation is called with the correct data', () => {
    it('should be successfull', () => {
      const schemaValidation = systemZodSchema.safeParse(mocks.system.instance);
      expect(schemaValidation.success).toBe(true);
    });
  });

  describe('When the zod validation is called with the incorrect data', () => {
    it('should fail', () => {
      const { name: _, ...systemMockWithoutName } = mocks.system.instance as ISystem;

      const schemaValidation = systemZodSchema.safeParse(systemMockWithoutName);
      expect(schemaValidation.success).toBe(false);
    });
  });
});

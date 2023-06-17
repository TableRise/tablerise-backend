import systemZodSchema from 'src/schemas/systemValidationSchema';
import systemMocks from 'src/support/schemas/systemMocks';

describe('Schemas :: SystemValidationSchema', () => {
  describe('When the zod validation is called with the correct data', () => {
    it('should be successfull', () => {
      const schemaValidation = systemZodSchema.safeParse(systemMocks.SYSTEM_INSTANCE_MOCK);
      expect(schemaValidation.success).toBe(true);
    });
  });

  describe('When the zod validation is called with the incorrect data', () => {
    it('should fail', () => {
      const { name: _, ...systemMockWithoutName } = systemMocks.SYSTEM_INSTANCE_MOCK;

      const schemaValidation = systemZodSchema.safeParse(systemMockWithoutName);
      expect(schemaValidation.success).toBe(false);
    });
  });
});

import godZodSchema, { IGod } from 'src/schemas/godsValidationSchema';
import mocks from 'src/support/mocks';

describe('Schemas :: GodsValidationSchema', () => {
  describe('When the zod validation is called with the correct data', () => {
    it('should be successfull', () => {
      const schemaValidation = godZodSchema.safeParse(mocks.god.instance);
      expect(schemaValidation.success).toBe(true);
    });
  });

  describe('When the zod validation is called with the incorrect data', () => {
    it('should fail', () => {
      const { name: _, ...godMockWithoutName } = mocks.god.instance as IGod;

      const schemaValidation = godZodSchema.safeParse(godMockWithoutName);
      expect(schemaValidation.success).toBe(false);
    });
  });
});

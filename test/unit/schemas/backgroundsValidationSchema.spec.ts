import backgroundZodSchema, { Background } from 'src/schemas/backgroundsValidationSchema';
import mocks from 'src/support/mocks';

describe('Schemas :: BackgroundsValidationSchema', () => {
  describe('When the zod validation is called with the correct data', () => {
    it('should be successfull', () => {
      const schemaValidation = backgroundZodSchema.safeParse(mocks.background.instance.en);
      expect(schemaValidation.success).toBe(true);
    });
  });

  describe('When the zod validation is called with the incorrect data', () => {
    it('should fail', () => {
      const { name: _, ...backgroundWithoutName } = mocks.background.instance.en as Background;

      const schemaValidation = backgroundZodSchema.safeParse(backgroundWithoutName);
      expect(schemaValidation.success).toBe(false);
    });
  });
});

import languagesWrapper from 'src/schemas/languagesWrapperSchema';
import godZodSchema from 'src/schemas/godsValidationSchema';
import mocks from 'src/support/mocks';

describe('Schemas :: LanguagesWrapperSchema', () => {
  describe('When the zod validation is called with the correct data', () => {
    it('should be successfull', () => {
      const schemaValidation = languagesWrapper(godZodSchema).safeParse({
        en: mocks.god.instance,
        pt: mocks.god.instance
      });
      expect(schemaValidation.success).toBe(true);
    });
  });

  describe('When the zod validation is called with the incorrect data', () => {
    it('should fail', () => {
      const schemaValidation = languagesWrapper(godZodSchema).safeParse({
        en: mocks.god.instance
      });
      expect(schemaValidation.success).toBe(false);
    });
  });
});

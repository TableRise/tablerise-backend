import updateContentZodSchema, { IUpdateContent } from 'src/schemas/updateContentSchema';
import mocks from 'src/support/mocks';

describe('Schemas :: UpdateContentSchema', () => {
  describe('When the zod validation is called with the correct data', () => {
    it('should be successfull', () => {
      const schemaValidation = updateContentZodSchema.safeParse(mocks.updateSystemContent.instance);
      expect(schemaValidation.success).toBe(true);
    });
  });

  describe('When the zod validation is called with the incorrect data', () => {
    it('should fail', () => {
      const { method: _, ...updateMockWithoutMethod } = mocks.updateSystemContent.instance as IUpdateContent;

      const schemaValidation = updateContentZodSchema.safeParse(updateMockWithoutMethod);
      expect(schemaValidation.success).toBe(false);
    });
  });
});

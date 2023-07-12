import itensZodSchema, { Item } from 'src/schemas/itensValidationSchema';
import mocks from 'src/support/mocks';

describe('Schemas :: ItensValidationSchema', () => {
  describe('When the zod validation is called with the correct data', () => {
    it('should be successfull', () => {
      const schemaValidation = itensZodSchema.safeParse(mocks.item.instance.en);
      expect(schemaValidation.success).toBe(true);
    });
  });

  describe('When the zod validation is called with the incorrect data', () => {
    it('should fail', () => {
      const { name: _, ...godMockWithoutName } = mocks.item.instance.en as Item;

      const schemaValidation = itensZodSchema.safeParse(godMockWithoutName);
      expect(schemaValidation.success).toBe(false);
    });
  });
});

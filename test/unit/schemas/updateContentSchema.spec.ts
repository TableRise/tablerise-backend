import schema from 'src/schemas';
import { UpdateContent } from 'src/schemas/updateContentSchema';
import mock from 'src/support/mocks/dungeons&dragons5e';

describe('Schemas :: DungeonsAndDragons5e :: UsersValidationSchema', () => {
    const content = mock.updateSystemContent.instance as UpdateContent;

    describe('When data is correct', () => {
        it('should not return errors', () => {
            const result = schema['dungeons&dragons5e'].updateContentZodSchema.safeParse(content);
            expect(result.success).toBe(true);
        });
    });

    describe('When data is incorrect', () => {
        it('should return errors', () => {
            const { newID: _, ...contentWithoutnewID } = content;
            const result = schema['dungeons&dragons5e'].updateContentZodSchema.safeParse(contentWithoutnewID);
            expect(result.success).toBe(false);
        });
    });
});

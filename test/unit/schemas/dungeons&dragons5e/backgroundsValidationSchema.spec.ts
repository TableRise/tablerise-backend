import schema from 'src/schemas';
import { Background } from 'src/schemas/dungeons&dragons5e/backgroundsValidationSchema';
import mock from 'src/support/mocks/dungeons&dragons5e';

describe('Schemas :: DungeonsAndDragons5e :: BackgroundsValidationSchema', () => {
    const background = mock.background.instance.en as Background;

    describe('When data is correct', () => {
        it('should not return errors', () => {
            const result = schema['dungeons&dragons5e'].backgroundZod.safeParse(background);
            expect(result.success).toBe(true);
        });
    });

    describe('When data is incorrect', () => {
        it('should return errors', () => {
            const { name: _, ...backgroundWithoutCost } = background;
            const result = schema['dungeons&dragons5e'].backgroundZod.safeParse(backgroundWithoutCost);
            expect(result.success).toBe(false);
        });
    });
});

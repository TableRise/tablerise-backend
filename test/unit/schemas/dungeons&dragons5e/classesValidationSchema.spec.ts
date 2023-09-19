import schema from 'src/schemas';
import { Class } from 'src/schemas/dungeons&dragons5e/classesValidationSchema';
import mock from 'src/support/mocks/dungeons&dragons5e';

describe('Schemas :: DungeonsAndDragons5e :: ClassesValidationSchema', () => {
    const classes = mock.class.instance.en as Class;

    describe('When data is correct', () => {
        it('should not return errors', () => {
            const result = schema['dungeons&dragons5e'].classZod.safeParse(classes);
            expect(result.success).toBe(true);
        });
    });

    describe('When data is incorrect', () => {
        it('should return errors', () => {
            const { name: _, ...classesWithoutCost } = classes;
            const result = schema['dungeons&dragons5e'].classZod.safeParse(classesWithoutCost);
            expect(result.success).toBe(false);
        });
    });
});

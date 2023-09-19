import schema from 'src/schemas';
import mock from 'src/support/mocks/user';

describe('Schemas :: DungeonsAndDragons5e :: UserValidationSchema', () => {
    const user = mock.user.user;

    describe('When data is correct', () => {
        it('should not return errors', () => {
            const result = schema.user.userZod.safeParse(user);
            expect(result.success).toBe(true);
        });
    });

    describe('When data is incorrect', () => {
        it('should return errors', () => {
            const { email: _, ...userWithoutCost } = user;
            const result = schema.user.userZod.safeParse(userWithoutCost);
            expect(result.success).toBe(false);
        });
    });
});

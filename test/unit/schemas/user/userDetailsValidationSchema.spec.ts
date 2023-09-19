import schema from 'src/schemas';
import mock from 'src/support/mocks/user';

describe('Schemas :: DungeonsAndDragons5e :: UsersValidationSchema', () => {
    const user = mock.user.userDetails;

    describe('When data is correct', () => {
        it('should not return errors', () => {
            const result = schema.user.userDetailZod.safeParse(user);
            expect(result.success).toBe(true);
        });
    });

    describe('When data is incorrect', () => {
        it('should return errors', () => {
            const { firstName: _, ...userWithoutCost } = user;
            const result = schema.user.userZod.safeParse(userWithoutCost);
            expect(result.success).toBe(false);
        });
    });
});

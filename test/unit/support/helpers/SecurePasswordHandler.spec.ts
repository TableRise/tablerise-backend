import { SecurePasswordHandler } from 'src/support/helpers/SecurePasswordHandler';

describe('Helpers :: SecurePasswordHandler', () => {
    describe('when the class is called', () => {
        it('should hash and compare passwords correctly', async () => {
            const plainPassword = 'password@security123';
            const hashedPassword = await SecurePasswordHandler.hashPassword(plainPassword);
            const isMatch = await SecurePasswordHandler.comparePassword(plainPassword, hashedPassword);

            expect(isMatch).toBe(true);
        });

        it('should return false for incorrect password comparison', async () => {
            const correctPassword = 'password@security123';
            const incorrectPassword = 'password';
            const hashedPassword = await SecurePasswordHandler.hashPassword(correctPassword);
            const isMatch = await SecurePasswordHandler.comparePassword(incorrectPassword, hashedPassword);

            expect(isMatch).toBe(false);
        });
    });
});

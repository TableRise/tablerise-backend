import SecurePasswordHandler from 'src/domains/users/helpers/SecurePasswordHandler';

describe('Domains :: User :: Helpers :: SecurePasswordHandler', () => {
    context('when the class is called', () => {
        it('should hash and compare passwords correctly', async () => {
            const plainPassword = 'password@security123';
            const hashedPassword = await SecurePasswordHandler.hashPassword(plainPassword);
            const isMatch = await SecurePasswordHandler.comparePassword(
                plainPassword,
                hashedPassword
            );

            expect(isMatch).to.be.equal(true);
        });

        it('should return false for incorrect password comparison', async () => {
            const correctPassword = 'password@security123';
            const incorrectPassword = 'password';
            const hashedPassword = await SecurePasswordHandler.hashPassword(correctPassword);
            const isMatch = await SecurePasswordHandler.comparePassword(
                incorrectPassword,
                hashedPassword
            );

            expect(isMatch).to.be.equal(false);
        });
    });
});

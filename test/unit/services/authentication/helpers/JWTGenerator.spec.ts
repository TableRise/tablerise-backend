import JWTGenerator from 'src/infra/helpers/JWTGenerator';
import mock from 'src/support/mocks/user';

describe('Support :: Helpers :: JWTGenerator', () => {
    let token: string;
    const user = mock.user.user;
    user._id = '651173f3a375db19fb9b5642';

    describe('When a payload is provided to method', () => {
        it('should return a token', () => {
            token = JWTGenerator.generate(user);
            expect(typeof token).toBe('string');
        });
    });

    describe('When verify a valid token', () => {
        it('should not throw any error and return the payload', () => {
            const payload = JWTGenerator.verify(token);
            expect(payload).toHaveProperty('userId');
            expect(payload).toHaveProperty('providerId');
            expect(payload).toHaveProperty('username');
        });
    });

    describe('When verify an invalid token', () => {
        it('should throw error but return false', () => {
            const failToken = token + '1';
            const payload = JWTGenerator.verify(failToken);
            expect(payload).toBe(false);
        });
    });
});

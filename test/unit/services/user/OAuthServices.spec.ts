import logger from '@tablerise/dynamic-logger';
import OAuthServices from 'src/services/user/OAuthServices';

describe('Services :: User :: OAuthServices', () => {
    const OAuthServicesMock = new OAuthServices(logger);

    const user = {};

    describe('When a signup is made through google', () => {
        it('test', async () => {
            const result = await OAuthServicesMock.google(user);
            expect(result).toBe(user);
        });
    });

    describe('When a signup is made through facebook', () => {
        it('test', async () => {
            const result = await OAuthServicesMock.facebook(user);
            expect(result).toBe(user);
        });
    });
});

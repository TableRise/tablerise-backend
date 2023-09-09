import logger from "@tablerise/dynamic-logger";
import OAuthServices from "src/services/user/OAuthServices";

describe('Services :: User :: OAuthServices', () => {
    const OAuthServicesMock = new OAuthServices(logger);

    const user = {};

    // beforeAll(() => {
    //     jest.spyOn(OAuthServicesMock, 'google').mockResolvedValue(user);
    // });

    describe('When a signup is made through google', () => {
        it('test', async () => {
            const result = await OAuthServicesMock.google(user);
            expect(result).toBe(user);
        })
    });
});
import DatabaseManagement from '@tablerise/database-management';
import logger from '@tablerise/dynamic-logger';
import OAuthServices from 'src/services/user/OAuthServices';
import HttpRequestErrors from 'src/support/helpers/HttpRequestErrors';
import mock from 'src/support/mocks/user';

describe('Services :: User :: OAuthServices', () => {
    const DM = new DatabaseManagement();

    const model = DM.modelInstance('user', 'Users');
    const modelDetails = DM.modelInstance('user', 'UserDetails');
    const OAuthServicesMock = new OAuthServices(model, modelDetails, logger);

    const userInstanceMock = mock.user.user;
    const userDetailsInstanceMock = mock.user.userDetails;
    userInstanceMock._id = '65075e05ca9f0d3b2485194f';
    userDetailsInstanceMock._id = '65075e05ca9f0d3b7485194f';

    const userProvidedGoogle = mock.googleProfile;
    const userProvidedFacebook = mock.facebookProfile;
    const userProvidedDiscord = mock.discordProfile;

    const userResponse = {
        ...userInstanceMock,
        details: userDetailsInstanceMock,
    };

    const userResponseKeys = Object.keys(userResponse);
    const userDetailsResponseKeys = Object.keys(userResponse.details);

    describe('When a signup is made through google', () => {
        beforeAll(() => {
            jest.spyOn(model, 'findAll').mockResolvedValue([]);
            jest.spyOn(model, 'create').mockResolvedValue({ _doc: userInstanceMock });
            jest.spyOn(modelDetails, 'create').mockResolvedValue(userDetailsInstanceMock);
        });

        it('should correctly register the user in database', async () => {
            const result = await OAuthServicesMock.google(userProvidedGoogle);

            userResponseKeys.forEach((key) => { expect(result).toHaveProperty(key) });
            userDetailsResponseKeys.forEach((key) => { expect(result.details).toHaveProperty(key) });
            expect(result.inProgress).toHaveProperty('status');
            expect(result.inProgress.status).toBe('wait_to_complete');
        });
    });

    describe('When a signup is made through google - email already exist', () => {
        beforeAll(() => {
            jest.spyOn(model, 'findAll').mockResolvedValue([{}]);
        });

        it('should not register the user in database and should throw an error', async () => {
            try {
                await OAuthServicesMock.google(userProvidedGoogle);
                expect('it should not be here').toBe(true);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err).toBeInstanceOf(HttpRequestErrors);
                expect(err.message).toBe('Email already exists in database');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });
    });

    describe('When a signup is made through facebook', () => {
        beforeAll(() => {
            jest.spyOn(model, 'findAll').mockResolvedValue([]);
            jest.spyOn(model, 'create').mockResolvedValue({ _doc: userInstanceMock });
            jest.spyOn(modelDetails, 'create').mockResolvedValue(userDetailsInstanceMock);
        });

        it('should correctly register the user in database', async () => {
            const result = await OAuthServicesMock.facebook(userProvidedFacebook);
            
            userResponseKeys.forEach((key) => { expect(result).toHaveProperty(key) });
            userDetailsResponseKeys.forEach((key) => { expect(result.details).toHaveProperty(key) });
            expect(result.inProgress).toHaveProperty('status');
            expect(result.inProgress.status).toBe('wait_to_complete');
        });
    });

    describe('When a signup is made through facebook - email already exist', () => {
        beforeAll(() => {
            jest.spyOn(model, 'findAll').mockResolvedValue([{}]);
        });

        it('should not register the user in database and should throw an error', async () => {
            try {
                await OAuthServicesMock.facebook(userProvidedFacebook);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err).toBeInstanceOf(HttpRequestErrors);
                expect(err.message).toBe('Email already exists in database');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });
    });

    describe('When a signup is made through discord', () => {
        beforeAll(() => {
            jest.spyOn(model, 'findAll').mockResolvedValue([]);
            jest.spyOn(model, 'create').mockResolvedValue({ _doc: userInstanceMock });
            jest.spyOn(modelDetails, 'create').mockResolvedValue(userDetailsInstanceMock);
        });

        it('should correctly register the user in database', async () => {
            const result = await OAuthServicesMock.discord(userProvidedDiscord);
            
            userResponseKeys.forEach((key) => { expect(result).toHaveProperty(key) });
            userDetailsResponseKeys.forEach((key) => { expect(result.details).toHaveProperty(key) });
            expect(result.inProgress).toHaveProperty('status');
            expect(result.inProgress.status).toBe('wait_to_complete');
        });
    });

    describe('When a signup is made through discord - email already exist', () => {
        beforeAll(() => {
            jest.spyOn(model, 'findAll').mockResolvedValue([{}]);
        });

        it('should not register the user in database and should throw an error', async () => {
            try {
                await OAuthServicesMock.discord(userProvidedDiscord);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err).toBeInstanceOf(HttpRequestErrors);
                expect(err.message).toBe('Email already exists in database');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });
    });
});

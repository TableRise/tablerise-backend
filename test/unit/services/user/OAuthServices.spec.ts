import DatabaseManagement from '@tablerise/database-management';
import logger from '@tablerise/dynamic-logger';
import OAuthServices from 'src/services/user/OAuthServices';
import HttpRequestErrors from 'src/infra/helpers/HttpRequestErrors';
import mock from 'src/support/mocks/user';
import { RegisterUserResponse } from 'src/types/requests/Response';

describe('Services :: User :: OAuthServices', () => {
    const database = new DatabaseManagement();

    const model = database.modelInstance('user', 'Users');
    const modelDetails = database.modelInstance('user', 'UserDetails');
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
            const result = (await OAuthServicesMock.google(userProvidedGoogle)) as RegisterUserResponse;

            userResponseKeys.forEach((key) => {
                expect(result).toHaveProperty(key);
            });
            userDetailsResponseKeys.forEach((key) => {
                expect(result.details).toHaveProperty(key);
            });
            expect(result.inProgress).toHaveProperty('status');
            expect(result.inProgress.status).toBe('wait_to_complete');
        });
    });

    describe('When a signup is made through google - login', () => {
        beforeAll(() => {
            jest.spyOn(model, 'findAll').mockResolvedValue([{ providerId: '1128493523316590413556' }]);
        });

        it('should not register the user but should complete login', async () => {
            const token = await OAuthServicesMock.google(userProvidedGoogle);
            expect(typeof token).toBe('string');
        });
    });

    describe('When a signup is made through google - email already registered but not by google', () => {
        beforeAll(() => {
            jest.spyOn(model, 'findAll').mockResolvedValue([{ providerId: '11284935' }]);
        });

        it('should not register the user in database and should throw an error', async () => {
            try {
                await OAuthServicesMock.google(userProvidedGoogle);
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
            const result = (await OAuthServicesMock.facebook(userProvidedFacebook)) as RegisterUserResponse;

            userResponseKeys.forEach((key) => {
                expect(result).toHaveProperty(key);
            });
            userDetailsResponseKeys.forEach((key) => {
                expect(result.details).toHaveProperty(key);
            });
            expect(result.inProgress).toHaveProperty('status');
            expect(result.inProgress.status).toBe('wait_to_complete');
        });
    });

    describe('When a signup is made through facebook - login', () => {
        beforeAll(() => {
            jest.spyOn(model, 'findAll').mockResolvedValue([{ providerId: '6413033402083491' }]);
        });

        it('should not register the user but should complete login', async () => {
            const token = await OAuthServicesMock.facebook(userProvidedFacebook);
            expect(typeof token).toBe('string');
        });
    });

    describe('When a signup is made through facebook - email already registered but not by facebook', () => {
        beforeAll(() => {
            jest.spyOn(model, 'findAll').mockResolvedValue([{ providerId: '641303' }]);
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
            const result = (await OAuthServicesMock.discord(userProvidedDiscord)) as RegisterUserResponse;

            userResponseKeys.forEach((key) => {
                expect(result).toHaveProperty(key);
            });
            userDetailsResponseKeys.forEach((key) => {
                expect(result.details).toHaveProperty(key);
            });
            expect(result.inProgress).toHaveProperty('status');
            expect(result.inProgress.status).toBe('wait_to_complete');
        });
    });

    describe('When a signup is made through Discord - login', () => {
        beforeAll(() => {
            jest.spyOn(model, 'findAll').mockResolvedValue([{ providerId: '784950523351513502' }]);
        });

        it('should not register the user but should complete login', async () => {
            const token = await OAuthServicesMock.discord(userProvidedDiscord);
            expect(typeof token).toBe('string');
        });
    });

    describe('When a signup is made through discord - email already exist', () => {
        beforeAll(() => {
            jest.spyOn(model, 'findAll').mockResolvedValue([{ providerId: '7849505' }]);
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

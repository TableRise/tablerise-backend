import DatabaseManagement from '@tablerise/database-management';
import logger from '@tablerise/dynamic-logger';
import UsersServices from 'src/services/user/UsersServices';
import ValidateData from 'src/support/helpers/ValidateData';
import mock from 'src/support/mocks/user';
import { RegisterUserPayload } from 'src/types/Response';
import schema from 'src/schemas';
import HttpRequestErrors from 'src/support/helpers/HttpRequestErrors';

jest.mock('qrcode', () => ({
    toDataURL: () => '',
}));

describe('Services :: User :: UsersServices', () => {
    const DM_MOCK = new DatabaseManagement();

    const ValidateDataMock = new ValidateData();

    const UsersModelMock = DM_MOCK.modelInstance('user', 'Users');
    const UsersDetailsModelMock = DM_MOCK.modelInstance('user', 'UserDetails');
    const UsersServicesMock = new UsersServices(
        UsersModelMock,
        UsersDetailsModelMock,
        logger,
        ValidateDataMock,
        schema.user
    );

    const userInstanceMock = mock.user.user;
    const updatedUserInstanceMock = { ...userInstanceMock, inProgress: { status: 'done', code: '1447ab' } };
    const userDetailsInstanceMock = mock.user.userDetails;
    userInstanceMock._id = '65075e05ca9f0d3b2485194f';
    const {
        providerId: _,
        createdAt: _1,
        updatedAt: _2,
        _id: _3,
        tag: _4,
        ...userInstanceMockPayload
    } = userInstanceMock;
    const { userId: _5, ...userDetailsInstanceMockPayload } = userDetailsInstanceMock;

    const userPayload = {
        ...userInstanceMockPayload,
        twoFactorSecret: { active: true },
        details: userDetailsInstanceMockPayload,
    };

    const userResponse = {
        ...userInstanceMock,
        details: userDetailsInstanceMock,
    };

    const userResponseKeys = Object.keys(userResponse);
    const userDetailsResponseKeys = Object.keys(userResponse.details);

    describe('When a new user is registered', () => {
        describe('and the data is correct', () => {
            beforeAll(() => {
                jest.spyOn(UsersModelMock, 'findAll').mockResolvedValue([]);
                jest.spyOn(UsersModelMock, 'create').mockResolvedValue({ _doc: userInstanceMock });
                jest.spyOn(UsersDetailsModelMock, 'create').mockResolvedValue(userDetailsInstanceMock);
            });

            it('should return the new user registered', async () => {
                const { twoFactorSecret, ...userPayloadWithoutTwoFactor } = userPayload;
                const result = await UsersServicesMock.register(userPayloadWithoutTwoFactor as RegisterUserPayload);

                userResponseKeys.forEach((key) => {
                    expect(result).toHaveProperty(key);
                });
                userDetailsResponseKeys.forEach((key) => {
                    expect(result.details).toHaveProperty(key);
                });
                expect(result.inProgress).toHaveProperty('status');
                expect(result.inProgress.status).toBe('wait_to_confirm');
            });
        });

        describe('and the data is correct - 2FA', () => {
            beforeAll(() => {
                jest.spyOn(UsersModelMock, 'findAll').mockResolvedValue([]);
                jest.spyOn(UsersModelMock, 'create').mockResolvedValue({ _doc: userInstanceMock });
                jest.spyOn(UsersDetailsModelMock, 'create').mockResolvedValue(userDetailsInstanceMock);
            });

            it('should return the new user registered', async () => {
                const result = await UsersServicesMock.register(userPayload as RegisterUserPayload);

                userResponseKeys.forEach((key) => {
                    expect(result).toHaveProperty(key);
                });
                userDetailsResponseKeys.forEach((key) => {
                    expect(result.details).toHaveProperty(key);
                });

                expect(result.inProgress).toHaveProperty('status');
                expect(result.inProgress.status).toBe('wait_to_confirm');
                expect(result.twoFactorSecret).toHaveProperty('code');
                expect(result.twoFactorSecret).toHaveProperty('qrcode');

                expect(Object.prototype.hasOwnProperty.call(result, 'active')).toBe(false);
            });
        });

        describe('and the data is incorrect - username', () => {
            beforeAll(() => {
                jest.spyOn(UsersModelMock, 'findAll').mockResolvedValueOnce([]).mockResolvedValue([{}]);
                jest.spyOn(UsersModelMock, 'create').mockResolvedValue(userResponse);
            });

            it('should throw 400 error - user already exist', async () => {
                try {
                    await UsersServicesMock.register(userPayload as RegisterUserPayload);
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;

                    expect(err.message).toStrictEqual('User already exists in database');
                    expect(err.name).toBe('BadRequest');
                    expect(err.code).toBe(400);
                }
            });
        });

        describe('and the data is incorrect - schema and email', () => {
            beforeAll(() => {
                jest.spyOn(UsersModelMock, 'findAll')
                    .mockResolvedValueOnce([{ email: userPayload.email }])
                    .mockResolvedValueOnce([])
                    .mockResolvedValueOnce([])
                    .mockResolvedValueOnce([{}]);
                jest.spyOn(UsersModelMock, 'create').mockResolvedValue(userResponse);
            });

            afterAll(() => {
                jest.clearAllMocks();
            });

            it('should throw 422 error - user schema', async () => {
                const { email: _, ...wrongUserPayload } = userPayload;
                try {
                    await UsersServicesMock.register(wrongUserPayload as RegisterUserPayload);
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;

                    expect(err.details).toHaveLength(1);
                    expect(err.details[0].attribute).toBe('email');
                    expect(err.details[0].reason).toBe('Required');
                    expect(err.code).toBe(422);
                    expect(err.name).toBe('ValidationError');
                }
            });

            it('should throw 422 error - user details schema', async () => {
                const { firstName: _, ...wrongUserDetailsPayload } = userDetailsInstanceMockPayload;
                const userDetailsWrongPayload = { ...userPayload, details: wrongUserDetailsPayload };
                try {
                    await UsersServicesMock.register(userDetailsWrongPayload as RegisterUserPayload);
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;

                    expect(err.details).toHaveLength(1);
                    expect(err.details[0].attribute).toBe('firstName');
                    expect(err.details[0].reason).toBe('Invalid input');
                    expect(err.code).toBe(422);
                    expect(err.name).toBe('ValidationError');
                }
            });

            it('should throw 400 error - email already exist', async () => {
                try {
                    await UsersServicesMock.register(userPayload as RegisterUserPayload);
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;

                    expect(err.message).toBe('Email already exists in database');
                    expect(err.code).toBe(400);
                    expect(err.name).toBe('BadRequest');
                }
            });
        });
    });

    describe('When a confirmation code is verified', () => {
        describe('and the params is correct', () => {
            beforeAll(() => {
                jest.spyOn(UsersModelMock, 'findOne').mockResolvedValue(userInstanceMock);
                jest.spyOn(UsersModelMock, 'update').mockResolvedValue(updatedUserInstanceMock);
            });

            it('should return the inProgress status has done', async () => {
                const result = await UsersServicesMock.confirmCode('65075e05ca9f0d3b2485194f', '1447ab');

                expect(result).toHaveProperty('status');
                expect(result.status).toBe('done');
            });
        });

        describe('and the params is incorrect - user id', () => {
            beforeAll(() => {
                jest.spyOn(UsersModelMock, 'findOne').mockResolvedValue(null);
            });

            it('should throw 404 error - user do not exist', async () => {
                try {
                    await UsersServicesMock.confirmCode('', '1447ab');
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;

                    expect(err.message).toStrictEqual('User not found in database');
                    expect(err.name).toBe('NotFound');
                    expect(err.code).toBe(404);
                }
            });
        });

        describe('and the params are incorrect - code', () => {
            beforeAll(() => {
                jest.spyOn(UsersModelMock, 'findOne').mockResolvedValue(userInstanceMock);
            });

            it('should throw 400 error - Invalide code', async () => {
                try {
                    await UsersServicesMock.confirmCode('65075e05ca9f0d3b2485194f', 'abcdef');
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;

                    expect(err.message).toStrictEqual('Invalid code');
                    expect(err.name).toBe('BadRequest');
                    expect(err.code).toBe(400);
                }
            });
        });
    });
});

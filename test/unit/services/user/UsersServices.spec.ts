import { User } from 'src/schemas/user/usersValidationSchema';
import logger from '@tablerise/dynamic-logger';
import UsersServices from 'src/services/user/UsersServices';
import SchemaValidator from 'src/services/helpers/SchemaValidator';
import mock from 'src/support/mocks/user';
import { RegisterUserPayload, RegisterUserResponse } from 'src/types/Response';
import schema from 'src/schemas';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';
import Database from '../../../support/Database';
import EmailSender from 'src/services/user/helpers/EmailSender';

jest.mock('qrcode', () => ({
    toDataURL: () => '',
}));

describe('Services :: User :: UsersServices', () => {
    let userServices: UsersServices,
    updatedInProgressToDone: User,
    updatedInProgressToVerify: User,
    userPayload: RegisterUserPayload,
    userResponse: RegisterUserResponse;

    const ValidateDataMock = new SchemaValidator();
    const { User, UserDetails } = Database.models;

    const userInstanceMock = mock.user.user;
    const userDetailsInstanceMock = mock.user.userDetails;
    userInstanceMock._id = '65075e05ca9f0d3b2485194f';
    const { userId: _5, ...userDetailsInstanceMockPayload } = userDetailsInstanceMock;

    describe('When a new user is registered', () => {
        beforeAll(() => {
            userServices = new UsersServices(
                User,
                UserDetails,
                logger,
                ValidateDataMock,
                schema.user
            );
        });

        describe('and the data is correct', () => {
            const { providerId, createdAt, updatedAt, _id, tag, ...userInstanceMockPayload } = userInstanceMock;

            beforeAll(() => {
                userPayload = {
                    ...userInstanceMockPayload,
                    twoFactorSecret: { active: true, code: '' },
                    nickname: 'test',
                    picture: 'test',
                    details: userDetailsInstanceMockPayload,
                }

                userResponse = {
                    ...userInstanceMock,
                    inProgress: { status: 'done', code: '' },
                    details: userDetailsInstanceMock,
                };

                jest.spyOn(User, 'findAll').mockResolvedValue([]);
                jest.spyOn(User, 'create').mockResolvedValue({ _doc: userInstanceMock });
                jest.spyOn(UserDetails, 'create').mockResolvedValue(userDetailsInstanceMock);
            });

            it('should return the new user registered', async () => {
                const userResponseKeys = Object.keys(userResponse);
                const userDetailsResponseKeys = Object.keys(userResponse.details);

                const { twoFactorSecret, ...userPayloadWithoutTwoFactor } = userPayload;
                const result = await userServices.register(userPayloadWithoutTwoFactor as RegisterUserPayload);

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
            const { providerId, createdAt, updatedAt, _id, tag, ...userInstanceMockPayload } = userInstanceMock;

            beforeAll(() => {
                userPayload = {
                    ...userInstanceMockPayload,
                    twoFactorSecret: { active: true, code: '' },
                    nickname: 'test',
                    picture: 'test',
                    details: userDetailsInstanceMockPayload,
                }

                userResponse = {
                    ...userInstanceMock,
                    inProgress: { status: 'done', code: '' },
                    details: userDetailsInstanceMock,
                };

                jest.spyOn(User, 'findAll').mockResolvedValue([]);
                jest.spyOn(User, 'create').mockResolvedValue({ _doc: userInstanceMock });
                jest.spyOn(UserDetails, 'create').mockResolvedValue(userDetailsInstanceMock);
            });

            it('should return the new user registered', async () => {
                const userResponseKeys = Object.keys(userResponse);
                const userDetailsResponseKeys = Object.keys(userResponse.details);

                const result = await userServices.register(userPayload);

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
                userResponse = {
                    ...userInstanceMock,
                    inProgress: { status: 'done', code: '' },
                    details: userDetailsInstanceMock,
                };

                jest.spyOn(User, 'findAll').mockResolvedValueOnce([]).mockResolvedValue([{}]);
                jest.spyOn(User, 'create').mockResolvedValue(userResponse);
            });

            it('should throw 400 error - user already exist', async () => {
                try {
                    await userServices.register(userPayload);
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;

                    expect(err.message).toStrictEqual('User with this tag already exists in database');
                    expect(err.name).toBe('BadRequest');
                    expect(err.code).toBe(400);
                }
            });
        });

        describe('and the data is incorrect - schema and email', () => {
            beforeAll(() => {
                jest.spyOn(User, 'findAll')
                    .mockResolvedValueOnce([{ email: userPayload.email }])
                    .mockResolvedValueOnce([])
                    .mockResolvedValueOnce([])
                    .mockResolvedValueOnce([{}]);
                jest.spyOn(User, 'create').mockResolvedValue(userResponse);
            });

            afterAll(() => {
                jest.clearAllMocks();
            });

            it('should throw 422 error - user schema', async () => {
                const { email: _, ...wrongUserPayload } = userPayload;
                try {
                    await userServices.register(wrongUserPayload as RegisterUserPayload);
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
                    await userServices.register(userDetailsWrongPayload as RegisterUserPayload);
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
                    await userServices.register(userPayload);
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
        beforeAll(() => {
            userServices = new UsersServices(
                User,
                UserDetails,
                logger,
                ValidateDataMock,
                schema.user
            );
        });

        describe('and the params are correct', () => {
            beforeAll(() => {
                updatedInProgressToDone = { ...userInstanceMock, inProgress: { status: 'done', code: '1447ab' } };

                jest.spyOn(User, 'findOne').mockResolvedValue(userInstanceMock);
                jest.spyOn(User, 'update').mockResolvedValue(updatedInProgressToDone);
            });

            it('should return the inProgress status has done', async () => {
                const result = await userServices.confirmCode('65075e05ca9f0d3b2485194f', '1447ab');

                expect(result).toHaveProperty('status');
                expect(result.status).toBe('done');
            });
        });

        describe('and the params are incorrect - user id', () => {
            beforeAll(() => {
                jest.spyOn(User, 'findOne').mockResolvedValue(null);
            });

            it('should throw 404 error - user do not exist', async () => {
                try {
                    await userServices.confirmCode('', '1447ab');
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;

                    expect(err.message).toStrictEqual('User does not exist');
                    expect(err.name).toBe('NotFound');
                    expect(err.code).toBe(404);
                }
            });
        });

        describe('and the params are incorrect - code', () => {
            beforeAll(() => {
                jest.spyOn(User, 'findOne').mockResolvedValue(userInstanceMock);
            });

            it('should throw 400 error - Wrong code', async () => {
                try {
                    await userServices.confirmCode('65075e05ca9f0d3b2485194f', 'abcdef');
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;

                    expect(err.message).toStrictEqual('Invalid code');
                    expect(err.name).toBe('BadRequest');
                    expect(err.code).toBe(400);
                }
            });

            it('should throw 400 error - Invalid code', async () => {
                try {
                    await userServices.confirmCode('65075e05ca9f0d3b2485194f', ['abcdef'] as unknown as string);
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;

                    expect(err.message).toStrictEqual('Query must be a string');
                    expect(err.name).toBe('BadRequest');
                    expect(err.code).toBe(400);
                }
            });
        });
    });

    describe('When a verify code is send by email', () => {
        userServices = new UsersServices(
            User,
            UserDetails,
            logger,
            ValidateDataMock,
            schema.user
        );

        describe('and the params are correct', () => {
            beforeAll(() => {
                updatedInProgressToVerify = { ...userInstanceMock, inProgress: { status: 'wait_to_verify', code: '1447ab' } };

                jest.spyOn(User, 'findOne').mockResolvedValueOnce(userInstanceMock)
                    .mockResolvedValue(null);
                jest.spyOn(EmailSender.prototype, 'send').mockResolvedValue({ success: true, verificationCode: '' })
                jest.spyOn(User, 'update').mockResolvedValue(updatedInProgressToVerify);
            });

            it('should return the inProgress status has wait_to_verify', async () => {
                try {
                    await userServices.emailVerify('65075e05ca9f0d3b2485194f');
                    expect(true).toBeTruthy();
                } catch (error) {
                    expect(error).toBeUndefined();
                }
            });
        });

        describe('and the params is incorrect - user id', () => {
            beforeAll(() => {
                jest.spyOn(User, 'findOne').mockResolvedValue(null);
            });

            it('should throw 404 error - user do not exist', async () => {
                try {
                    await userServices.emailVerify('');
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;

                    expect(err.message).toStrictEqual('User does not exist');
                    expect(err.name).toBe('NotFound');
                    expect(err.code).toBe(404);
                }
            });
        });

        describe('and the params is incorrect - email send', () => {
            const userStatusValid = { ...userInstanceMock, inProgress: { status: 'done' } };

            beforeAll(() => {
                jest.spyOn(User, 'findOne').mockResolvedValue(userStatusValid);
                jest.spyOn(EmailSender.prototype, 'send').mockResolvedValue({ success: false, verificationCode: '' })
            });

            it('should throw 400 error - email send failed', async () => {
                try {
                    await userServices.emailVerify('65075e05ca9f0d3b2485194f');
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).toStrictEqual('Some problem ocurred in email sending');
                    expect(err.name).toBe('BadRequest');
                    expect(err.code).toBe(400);
                }
            });
        });

        describe('and the params is incorrect - user status', () => {
            const userStatusInvalid = { ...userInstanceMock, inProgress: { status: 'wait_to_complete' } };

            beforeAll(() => {
                jest.spyOn(User, 'findOne').mockResolvedValue(userStatusInvalid);
            });

            it('should throw 400 error - user status is invalid', async () => {
                try {
                    await userServices.emailVerify('65075e05ca9f0d3b2485194f');
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).toStrictEqual('User status is invalid to perform this operation');
                    expect(err.name).toBe('BadRequest');
                    expect(err.code).toBe(400);
                }
            });
        });
    });
});

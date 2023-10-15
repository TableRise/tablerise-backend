import { User } from 'src/schemas/user/usersValidationSchema';
import logger from '@tablerise/dynamic-logger';
import UsersServices from 'src/services/user/UsersServices';
import SchemaValidator from 'src/services/helpers/SchemaValidator';
import { RegisterUserPayload, RegisterUserResponse, emailUpdatePayload } from 'src/types/Response';
import schema from 'src/schemas';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';
import Database from '../../../support/Database';
import EmailSender from 'src/services/user/helpers/EmailSender';
import { UserDetail } from 'src/schemas/user/userDetailsValidationSchema';
import GeneralDataFaker, { UserFaker, UserDetailFaker } from '../../../support/datafakers/GeneralDataFaker';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import speakeasy from 'speakeasy';

jest.mock('qrcode', () => ({
    toDataURL: () => '',
}));

describe('Services :: User :: UsersServices', () => {
    let user: User,
        userDetails: UserDetail,
        userServices: UsersServices,
        updatedInProgressToDone: User,
        updatedInProgressToVerify: User,
        userPayload: RegisterUserPayload,
        userResponse: RegisterUserResponse,
        deleteResponse: any,
        emailRequest: emailUpdatePayload;

    const ValidateDataMock = new SchemaValidator();
    const { User, UserDetails } = Database.models;

    describe('When a new user is registered', () => {
        beforeAll(() => {
            user = GeneralDataFaker.generateUserJSON({} as UserFaker).map((user) => {
                delete user._id;
                delete user.tag;
                delete user.providerId;

                return user;
            })[0];

            userDetails = GeneralDataFaker.generateUserDetailJSON({} as UserDetailFaker).map((detail) => {
                delete detail._id;
                delete detail.userId;

                return detail;
            })[0];

            userServices = new UsersServices(User, UserDetails, logger, ValidateDataMock, schema.user);
        });

        describe('and the data is correct', () => {
            beforeAll(() => {
                userPayload = { ...user, details: userDetails } as RegisterUserPayload;
                userResponse = { ...user, details: userDetails } as RegisterUserResponse;

                jest.spyOn(User, 'findAll').mockResolvedValue([]);
                jest.spyOn(User, 'create').mockResolvedValue({
                    _doc: {
                        ...user,
                        inProgress: { status: 'wait_to_confirm', code: 'KIIOL41' },
                        _id: generateNewMongoID(),
                    },
                });
                jest.spyOn(User, 'update').mockResolvedValue({});
                jest.spyOn(UserDetails, 'create').mockResolvedValue(userDetails);
                jest.spyOn(EmailSender.prototype, 'send').mockResolvedValue({
                    success: true,
                    verificationCode: 'KKI450',
                });
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
            });
        });

        describe('and the data is correct - 2FA', () => {
            beforeAll(() => {
                userPayload = { ...user, details: userDetails } as RegisterUserPayload;
                userResponse = { ...user, details: userDetails } as RegisterUserResponse;
                // @ts-expect-error Intentional error
                user.twoFactorSecret?.code = 'test';
                // @ts-expect-error Intentional error
                user.twoFactorSecret?.qrcode = 'test';

                jest.spyOn(User, 'findAll').mockResolvedValue([]);
                jest.spyOn(User, 'create').mockResolvedValue({
                    _doc: {
                        ...user,
                        inProgress: { status: 'wait_to_confirm', code: 'KIIOL41' },
                        _id: generateNewMongoID(),
                    },
                });
                jest.spyOn(User, 'update').mockResolvedValue({});
                jest.spyOn(UserDetails, 'create').mockResolvedValue(userDetails);
                jest.spyOn(EmailSender.prototype, 'send').mockResolvedValue({
                    success: true,
                    verificationCode: 'KKI450',
                });
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
                userResponse = { ...user, details: userDetails } as RegisterUserResponse;

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
                user = GeneralDataFaker.generateUserJSON({} as UserFaker).map((user) => {
                    delete user._id;
                    delete user.tag;
                    delete user.providerId;

                    return user;
                })[0];

                userDetails = GeneralDataFaker.generateUserDetailJSON({} as UserDetailFaker).map((detail) => {
                    delete detail._id;
                    delete detail.userId;

                    return detail;
                })[0];

                userPayload = { ...user, details: userDetails } as RegisterUserPayload;
                userResponse = { ...user, details: userDetails } as RegisterUserResponse;

                jest.spyOn(User, 'findAll').mockResolvedValue([{ email: userPayload.email }]);
                jest.spyOn(User, 'create').mockResolvedValue(userResponse);
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
                const wrongUserDetailsPayload = userDetails;
                // @ts-expect-error Error intetional below
                delete wrongUserDetailsPayload.firstName;

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
        });

        describe('and email sending fails', () => {
            beforeAll(() => {
                user = GeneralDataFaker.generateUserJSON({} as UserFaker).map((user) => {
                    delete user._id;
                    delete user.tag;
                    delete user.providerId;

                    return user;
                })[0];

                userDetails = GeneralDataFaker.generateUserDetailJSON({} as UserDetailFaker).map((detail) => {
                    delete detail._id;
                    delete detail.userId;

                    return detail;
                })[0];

                userPayload = { ...user, details: userDetails } as RegisterUserPayload;
                userResponse = { ...user, details: userDetails } as RegisterUserResponse;

                jest.spyOn(User, 'findAll').mockResolvedValue([]);
                jest.spyOn(User, 'create').mockResolvedValue({ _doc: user });
                jest.spyOn(UserDetails, 'create').mockResolvedValue(userDetails);
                jest.spyOn(EmailSender.prototype, 'send').mockResolvedValue({ success: false });
            });

            it('should throw 400 error', async () => {
                try {
                    await userServices.register(userPayload);
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).toStrictEqual('Some problem ocurred in email sending');
                    expect(err.name).toBe('BadRequest');
                    expect(err.code).toBe(400);
                }
            });
        });
    });

    describe('When a confirmation code is verified', () => {
        beforeAll(() => {
            user = GeneralDataFaker.generateUserJSON({} as UserFaker).map((user) => {
                delete user._id;
                delete user.tag;
                delete user.providerId;

                return user;
            })[0];

            userDetails = GeneralDataFaker.generateUserDetailJSON({} as UserDetailFaker).map((detail) => {
                delete detail._id;
                delete detail.userId;

                return detail;
            })[0];

            userServices = new UsersServices(User, UserDetails, logger, ValidateDataMock, schema.user);
        });

        describe('and the params are correct', () => {
            beforeAll(() => {
                updatedInProgressToDone = { ...user, inProgress: { status: 'done', code: '1447ab' } };
                // @ts-expect-error InProgress will exist;
                user.inProgress?.code = '1447ab';

                jest.spyOn(User, 'findOne').mockResolvedValue(user);
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
                jest.spyOn(User, 'findOne').mockResolvedValue(user);
            });

            it('should throw 400 error - Invalid email verify code', async () => {
                try {
                    await userServices.confirmCode('65075e05ca9f0d3b2485194f', 'abcdef');
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;

                    expect(err.message).toStrictEqual('Invalid email verify code');
                    expect(err.name).toBe('BadRequest');
                    expect(err.code).toBe(400);
                }
            });

            it('should throw 400 error - Query must be a string', async () => {
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
        beforeAll(() => {
            user = GeneralDataFaker.generateUserJSON({} as UserFaker).map((user) => {
                delete user._id;
                delete user.tag;
                delete user.providerId;

                return user;
            })[0];

            userDetails = GeneralDataFaker.generateUserDetailJSON({} as UserDetailFaker).map((detail) => {
                delete detail._id;
                delete detail.userId;

                return detail;
            })[0];

            userServices = new UsersServices(User, UserDetails, logger, ValidateDataMock, schema.user);
        });

        describe('and the params are correct', () => {
            beforeAll(() => {
                updatedInProgressToVerify = { ...user, inProgress: { status: 'wait_to_verify', code: '1447ab' } };
                // @ts-expect-error InProgress will exist;
                user.inProgress?.code = '1447ab';

                jest.spyOn(User, 'findOne').mockResolvedValueOnce(user).mockResolvedValue(null);
                jest.spyOn(EmailSender.prototype, 'send').mockResolvedValue({ success: true, verificationCode: '' });
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
            const userStatusValid = { ...user, inProgress: { status: 'done' } };

            beforeAll(() => {
                jest.spyOn(User, 'findOne').mockResolvedValue(userStatusValid);
                jest.spyOn(EmailSender.prototype, 'send').mockResolvedValue({ success: false, verificationCode: '' });
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
            const userStatusInvalid = { ...user, inProgress: { status: 'wait_to_complete' } };

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
                }
            });
        });
    });

    describe('When 2FA is activated', () => {
        beforeAll(() => {
            user = GeneralDataFaker.generateUserJSON({} as UserFaker).map((user) => {
                delete user._id;
                delete user.tag;
                delete user.providerId;

                return user;
            })[0];

            userDetails = GeneralDataFaker.generateUserDetailJSON({} as UserDetailFaker).map((detail) => {
                delete detail._id;
                delete detail.userId;

                return detail;
            })[0];

            userServices = new UsersServices(User, UserDetails, logger, ValidateDataMock, schema.user);
        });

        describe('and the params are correct', () => {
            beforeAll(() => {
                user.twoFactorSecret = { active: false };

                jest.spyOn(User, 'findOne').mockResolvedValue(user);
                jest.spyOn(UserDetails, 'findAll').mockResolvedValue([userDetails]);
                jest.spyOn(User, 'update').mockResolvedValue({
                    ...user,
                    twoFactorSecret: {
                        secret: 'test',
                        qrcode: 'testCode',
                        active: true,
                    },
                });
                jest.spyOn(UserDetails, 'update').mockResolvedValue({ ...userDetails, secretQuestion: null });
            });

            it('should update the user to have 2FA activated', async () => {
                const result = await userServices.activateTwoFactor(user._id as string);

                expect(result).toHaveProperty('qrcode');
                expect(result).toHaveProperty('active');
                expect(result.qrcode).toBe('');
                expect(result.active).toBe(true);
            });
        });

        describe('and the params is incorrect - user id', () => {
            beforeAll(() => {
                jest.spyOn(User, 'findOne').mockResolvedValue(null);
            });

            it('should throw 404 error - user do not exist', async () => {
                try {
                    await userServices.activateTwoFactor('');
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;

                    expect(err.message).toStrictEqual('User does not exist');
                    expect(err.name).toBe('NotFound');
                    expect(err.code).toBe(404);
                }
            });
        });

        describe('and the params is incorrect - user details id', () => {
            beforeAll(() => {
                user.twoFactorSecret.active = false;

                jest.spyOn(User, 'findOne').mockResolvedValue(user);
                jest.spyOn(UserDetails, 'findAll').mockResolvedValue([]);
            });

            it('should throw 404 error - user do not exist', async () => {
                try {
                    await userServices.activateTwoFactor('');
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;

                    expect(err.message).toStrictEqual('User does not exist');
                    expect(err.name).toBe('NotFound');
                    expect(err.code).toBe(404);
                }
            });
        });

        describe('and the user already have 2FA', () => {
            beforeAll(() => {
                user.twoFactorSecret.active = true;

                jest.spyOn(User, 'findOne').mockResolvedValue(user);
                jest.spyOn(UserDetails, 'findAll').mockResolvedValue([userDetails]);
            });

            it('should throw 400 error - 2fa already activated', async () => {
                try {
                    await userServices.activateTwoFactor(user._id as string);
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).toStrictEqual('2FA is already enabled for this user');
                    expect(err.name).toBe('BadRequest');
                    expect(err.code).toBe(400);
                }
            });
        });
    });

    describe('When update user email', () => {
        beforeAll(() => {
            user = GeneralDataFaker.generateUserJSON({} as UserFaker).map((user) => {
                delete user._id;
                delete user.tag;
                delete user.providerId;

                return user;
            })[0];

            userDetails = GeneralDataFaker.generateUserDetailJSON({} as UserDetailFaker).map((detail) => {
                delete detail._id;
                delete detail.userId;

                return detail;
            })[0];

            userServices = new UsersServices(User, UserDetails, logger, ValidateDataMock, schema.user);

            emailRequest = { email: 'new-email@email.com' };
        });

        describe('and the params is correct', () => {
            beforeAll(() => {
                // @ts-expect-error InProgress will exist;
                user.inProgress?.code = 'IQSMPW';
                jest.spyOn(User, 'findOne').mockResolvedValue(user);
                jest.spyOn(User, 'findAll').mockResolvedValue([]);
                jest.spyOn(User, 'update').mockResolvedValue({});
            });

            it('should return nothing', async () => {
                await userServices.updateEmail('65075e05ca9f0d3b2485194f', 'IQSMPW', emailRequest);
            });
        });

        describe('and the params are incorrect - user id and code', () => {
            beforeAll(() => {
                jest.spyOn(User, 'findOne').mockResolvedValueOnce(null).mockResolvedValue(user);
            });

            it('should throw 404 error - user do not exist', async () => {
                try {
                    await userServices.updateEmail('', 'IQSMPW', emailRequest);
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;

                    expect(err.message).toStrictEqual('User does not exist');
                    expect(err.name).toBe('NotFound');
                    expect(err.code).toBe(404);
                }
            });

            it('should throw 400 error - Invalid email verify code', async () => {
                try {
                    await userServices.updateEmail('65075e05ca9f0d3b2485194f', 'WRONG_CODE', emailRequest);
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;

                    expect(err.message).toStrictEqual('Invalid email verify code');
                    expect(err.name).toBe('BadRequest');
                    expect(err.code).toBe(400);
                }
            });

            it('should throw 400 error - Query must be a string', async () => {
                try {
                    await userServices.updateEmail(
                        '65075e05ca9f0d3b2485194f',
                        ['NOT_A_STRING'] as unknown as string,
                        emailRequest
                    );
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;

                    expect(err.message).toStrictEqual('Query must be a string');
                    expect(err.name).toBe('BadRequest');
                    expect(err.code).toBe(400);
                }
            });
        });

        describe('and the email requested already exists in the database - email', () => {
            beforeAll(() => {
                // @ts-expect-error InProgress will exist;
                user.inProgress?.code = 'IQSMPW';
                jest.spyOn(User, 'findOne').mockResolvedValue(user);
                jest.spyOn(User, 'findAll').mockResolvedValue([{}]);
            });

            it('should throw 400 error - email already exist', async () => {
                try {
                    await userServices.updateEmail('65075e05ca9f0d3b2485194f', 'IQSMPW', emailRequest);
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;

                    expect(err.message).toStrictEqual('Email already exists in database');
                    expect(err.name).toBe('BadRequest');
                    expect(err.code).toBe(400);
                }
            });
        });
    });

    describe('When delete a user', () => {
        beforeAll(() => {
            user = GeneralDataFaker.generateUserJSON({} as UserFaker).map((user) => {
                delete user._id;
                delete user.tag;
                delete user.providerId;
                delete user.inProgress;

                return user;
            })[0];

            userDetails = GeneralDataFaker.generateUserDetailJSON({} as UserDetailFaker).map((detail) => {
                delete detail._id;
                delete detail.userId;

                return detail;
            })[0];

            userServices = new UsersServices(User, UserDetails, logger, ValidateDataMock, schema.user);
        });

        describe('and the params is correct', () => {
            beforeAll(() => {
                deleteResponse = { deleteCount: 1 };
                jest.spyOn(UserDetails, 'findAll').mockResolvedValue([userDetails]);
                jest.spyOn(User, 'delete').mockResolvedValue(deleteResponse);
            });

            it('should return nothing', async () => {
                await userServices.delete('65075e05ca9f0d3b2485194f');
            });
        });

        describe('and the params is incorrect - user id', () => {
            beforeAll(() => {
                jest.spyOn(UserDetails, 'findAll').mockResolvedValue([]);
            });

            it('should throw 404 error - user do not exist', async () => {
                try {
                    await userServices.delete('');
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;

                    expect(err.message).toStrictEqual('User does not exist');
                    expect(err.name).toBe('NotFound');
                    expect(err.code).toBe(404);
                }
            });
        });

        describe('and theres is a campaign or a character linked to the user', () => {
            beforeAll(() => {
                userDetails.gameInfo.campaigns = ['123456789123456789123456'];
                userDetails.gameInfo.characters = ['123456789123456789123456'];
                jest.spyOn(UserDetails, 'findAll').mockResolvedValue([userDetails]);
            });

            it('should throw 401 error - Unauthorized', async () => {
                try {
                    await userServices.delete('123456789123456789123456');
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;

                    expect(err.message).toStrictEqual('There is a campaing or character linked to this user');
                    expect(err.name).toBe('Unauthorized');
                    expect(err.code).toBe(401);
                }
            });
        });
    });

    describe('When reset 2FA', () => {
        beforeAll(() => {
            user = GeneralDataFaker.generateUserJSON({} as UserFaker).map((user) => {
                delete user._id;
                delete user.tag;
                delete user.providerId;

                return user;
            })[0];

            userServices = new UsersServices(User, UserDetails, logger, ValidateDataMock, schema.user);
        });

        describe('and the params are correct', () => {
            beforeAll(() => {
                // @ts-expect-error InProgress will exist;
                user.inProgress?.code = 'confirmCode';
                user.twoFactorSecret = {
                    secret: 'old_secret',
                    qrcode: '',
                    active: true,
                };

                jest.spyOn(User, 'findOne').mockResolvedValue(user);
                jest.spyOn(speakeasy, 'generateSecret').mockReturnValue({ base32: 'secret' } as never);
                jest.spyOn(User, 'update').mockResolvedValue({
                    ...user,
                });
            });

            it('should reset the 2FA', async () => {
                const code = 'confirmCode';
                const result = await userServices.resetTwoFactor(user._id as string, code);

                expect(result).toHaveProperty('qrcode');
                expect(result.qrcode).toBe('');
                expect(result).toHaveProperty('active');
                expect(result.active).toBe(true);
            });
        });

        describe('and the params is incorrect - user id', () => {
            beforeAll(() => {
                jest.spyOn(User, 'findOne').mockResolvedValue(null);
            });

            it('should throw 404 error - user not found ', async () => {
                try {
                    await userServices.resetTwoFactor('', '1447ab');
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;

                    expect(err.message).toStrictEqual('User does not exist');
                    expect(err.name).toBe('NotFound');
                    expect(err.code).toBe(404);
                }
            });
        });

        describe('and the 2FA is disabled', () => {
            beforeAll(() => {
                user.twoFactorSecret.active = false;
                jest.spyOn(User, 'findOne').mockResolvedValue(user);
            });

            it('should throw 400 error - 2FA not activate', async () => {
                try {
                    await userServices.resetTwoFactor(user._id as string, user.inProgress?.code as string);
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).toStrictEqual('2FA not enabled for this user');
                    expect(err.name).toBe('BadRequest');
                    expect(err.code).toBe(400);
                }
            });
        });

        describe('and the params is incorrect - code', () => {
            beforeAll(() => {
                user.twoFactorSecret.active = true;
                jest.spyOn(User, 'findOne').mockResolvedValue(user);
            });

            it('should throw 400 error - Wrong code', async () => {
                try {
                    await userServices.resetTwoFactor(user._id as string, 'abcdef');
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;

                    expect(err.message).toStrictEqual('Invalid email verify code');
                    expect(err.name).toBe('BadRequest');
                    expect(err.code).toBe(400);
                }
            });
        });
    });
});

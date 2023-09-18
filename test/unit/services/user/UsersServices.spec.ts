import DatabaseManagement from '@tablerise/database-management';
import logger from '@tablerise/dynamic-logger';
import UsersServices from 'src/services/user/UsersServices';
import ValidateData from 'src/support/helpers/ValidateData';
import mock from 'src/support/mocks/user';
import { RegisterUserPayload } from 'src/types/Response';
import schema from 'src/schemas';

describe('Services :: User :: UsersServices', () => {
    const DM_MOCK = new DatabaseManagement();

    const ValidateDataMock = new ValidateData(logger);

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
        details: userDetailsInstanceMockPayload,
    };

    const userResponse = {
        ...userInstanceMock,
        details: userDetailsInstanceMock,
    };

    describe('When a new user is registered', () => {
        describe('and the data is correct', () => {
            beforeAll(() => {
                jest.spyOn(UsersModelMock, 'findAll').mockResolvedValue([]);
                jest.spyOn(UsersModelMock, 'create').mockResolvedValue(userResponse);
            });

            it('should return the new user registered', async () => {
                const result = await UsersServicesMock.register(userPayload as RegisterUserPayload);
                expect(result).toBe(userResponse);
            });
        });

        describe('and the data is incorrect', () => {
            beforeAll(() => {
                jest.spyOn(UsersModelMock, 'findAll').mockResolvedValue([{ email: userPayload.email }]);
                jest.spyOn(UsersModelMock, 'create').mockResolvedValue(userResponse);
            });

            it('should throw 422 error - schema', async () => {
                const { email: _, ...wrongUserPayload } = userPayload;
                try {
                    await UsersServicesMock.register(wrongUserPayload as RegisterUserPayload);
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as Error;

                    expect(JSON.parse(err.message)).toHaveLength(1);
                    expect(JSON.parse(err.message)[0].path).toStrictEqual(['email']);
                    expect(JSON.parse(err.message)[0].message).toBe('Required');
                    expect(err.stack).toBe('422');
                    expect(err.name).toBe('ValidationError');
                }
            });

            it('should throw 400 error - email already exist', async () => {
                try {
                    await UsersServicesMock.register(userPayload as RegisterUserPayload);
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as Error;

                    expect(JSON.parse(err.message)).toHaveLength(1);
                    expect(JSON.parse(err.message)[0].path).toStrictEqual(['email']);
                    expect(JSON.parse(err.message)[0].message).toBe('Required');
                    expect(err.stack).toBe('422');
                    expect(err.name).toBe('ValidationError');
                }
            });
        });
    });
});

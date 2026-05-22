import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import UpdateUserService from 'src/core/users/services/users/UpdateUserService';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import User from '@tablerise/database-management/dist/src/interfaces/User';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Core :: Users :: Services :: UpdateUserService', () => {
    let updateUserService: UpdateUserService, usersRepository: any, userToUpdate: any, user: User;

    const logger = (): void => {};

    context('#Update', () => {
        context('When update with success', () => {
            before(() => {
                userToUpdate = DomainDataFaker.mocks.updateUserMock;
                user = DomainDataFaker.generateUsersJSON()[0];

                usersRepository = {
                    findOne: () => user,
                    update: () => ({
                        ...user,
                        ...userToUpdate,
                    }),
                };

                updateUserService = new UpdateUserService({
                    usersRepository,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const userUpdatePayload = {
                    userId: user.userId,
                    payload: userToUpdate,
                };

                const userUpdateResponse = await updateUserService.update(userUpdatePayload);

                expect(userUpdateResponse.nickname).to.be.equal(userToUpdate.nickname);
            });
        });

        context('When validateUpdateData fail with user', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                usersRepository = {
                    findOne: () => user,
                    update: () => user,
                };

                updateUserService = new UpdateUserService({
                    usersRepository,
                    logger,
                });
            });

            it('should throw an error', async () => {
                try {
                    const userPayload = {
                        userId: user.userId,
                        payload: user,
                    };

                    await updateUserService.update(userPayload);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Update User Info - forbidden field: userId exists in payload');
                    expect(err.name).to.be.equal('ForbiddenRequest');
                    expect(err.code).to.be.equal(HttpStatusCode.FORBIDDEN);
                }
            });
        });

        context('When validateUpdateData fail with user picture', () => {
            before(() => {
                userToUpdate = DomainDataFaker.mocks.updateUserMock;
                user = DomainDataFaker.generateUsersJSON()[0];
                usersRepository = {
                    findOne: () => user,
                    update: () => user,
                };

                userToUpdate = {
                    ...userToUpdate,
                    picture: user.picture,
                };

                updateUserService = new UpdateUserService({
                    usersRepository,
                    logger,
                });
            });

            it('should throw an error', async () => {
                try {
                    const userPayload = {
                        userId: user.userId,
                        payload: userToUpdate,
                    };

                    await updateUserService.update(userPayload);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Update User Info - forbidden field: picture exists in payload');
                    expect(err.name).to.be.equal('ForbiddenRequest');
                    expect(err.code).to.be.equal(HttpStatusCode.FORBIDDEN);
                }
            });
        });
    });
});

import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import UpdateUserService from 'src/core/users/services/users/UpdateUserService';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Core :: Users :: Services :: UpdateUserService', () => {
    let updateUserService: UpdateUserService,
        usersRepository: any,
        usersDetailsRepository: any,
        userToUpdate: any,
        user: UserInstance,
        userDetails: UserDetailInstance;

    const logger = (): void => {};

    context('#Update', () => {
        context('When update with success', () => {
            before(() => {
                userToUpdate = DomainDataFaker.mocks.updateUserMock;
                user = DomainDataFaker.generateUsersJSON()[0];

                usersRepository = {
                    findOne: () => [],
                };

                usersDetailsRepository = {
                    findOne: () => [],
                };

                updateUserService = new UpdateUserService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const userUpdatePayload = {
                    userId: user.userId,
                    payload: userToUpdate,
                };

                const userUpdateResponse = await updateUserService.update(
                    userUpdatePayload
                );

                expect(userUpdateResponse.user.nickname).to.be.equal(
                    userToUpdate.nickname
                );
                expect(userUpdateResponse.userDetails.firstName).to.be.equal(
                    userToUpdate.details.firstName
                );
            });
        });

        context('When validateUpdateData fail with user', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                usersRepository = {
                    findOne: () => [],
                };

                usersDetailsRepository = {
                    findOne: () => [],
                };

                updateUserService = new UpdateUserService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should throw an error', async () => {
                try {
                    const userPayload = {
                        userId: user.userId,
                        payload: {
                            ...user,
                            details: userDetails,
                        },
                    };

                    await updateUserService.update(userPayload);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal(
                        'Update User Info - forbidden field: userId exists in payload'
                    );
                    expect(err.name).to.be.equal('ForbiddenRequest');
                    expect(err.code).to.be.equal(HttpStatusCode.FORBIDDEN);
                }
            });
        });

        context('When validateUpdateData fail with user details', () => {
            before(() => {
                userToUpdate = DomainDataFaker.mocks.updateUserMock;
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                usersRepository = {
                    findOne: () => [],
                };

                userToUpdate.details.userId = userDetails.userId;

                usersDetailsRepository = {
                    findOne: () => [],
                };

                updateUserService = new UpdateUserService({
                    usersRepository,
                    usersDetailsRepository,
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
                    expect(err.message).to.be.equal(
                        'Update User Info - forbidden field: userId exists in payload'
                    );
                    expect(err.name).to.be.equal('ForbiddenRequest');
                    expect(err.code).to.be.equal(HttpStatusCode.FORBIDDEN);
                }
            });
        });
    });

    context('#Save', () => {
        context('When save with success', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                usersRepository = {
                    update: () => user,
                };

                usersDetailsRepository = {
                    update: () => userDetails,
                };

                updateUserService = new UpdateUserService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const userSavePayload = {
                    user,
                    userDetails,
                };

                const userSaveResponse = await updateUserService.save(userSavePayload);

                expect(userSaveResponse.nickname).to.be.equal(user.nickname);
                expect(userSaveResponse.details.firstName).to.be.equal(
                    userDetails.firstName
                );
            });
        });
    });
});

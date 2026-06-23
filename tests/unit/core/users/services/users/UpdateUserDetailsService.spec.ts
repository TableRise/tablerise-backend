import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import UpdateUserDetailsService from 'src/core/users/services/users/UpdateUserDetailsService';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Core :: Users :: Services :: UpdateUserDetailsService', () => {
    let updateUserDetailsService: UpdateUserDetailsService,
        usersDetailsRepository: any,
        userDetailsToUpdate: any,
        userDetails: UserDetail;

    const logger = (): void => {};

    context('#Update', () => {
        context('When update with success', () => {
            before(() => {
                userDetailsToUpdate = DomainDataFaker.mocks.updateUserDetailsMock;
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                usersDetailsRepository = {
                    findOne: () => userDetails,
                    update: () => ({
                        ...userDetails,
                        ...userDetailsToUpdate,
                    }),
                };

                updateUserDetailsService = new UpdateUserDetailsService({
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const userUpdateResponse = await updateUserDetailsService.update({
                    userId: userDetails.userId,
                    payload: userDetailsToUpdate,
                });

                expect(userUpdateResponse.firstName).to.be.equal(userDetailsToUpdate.firstName);
                expect(userUpdateResponse.biography).to.be.equal(userDetailsToUpdate.biography);
                expect(userUpdateResponse).to.have.property('gender').that.equals(userDetailsToUpdate.gender);
                expect(userUpdateResponse.title).to.be.equal(userDetailsToUpdate.title);
            });
        });

        context('When validateUpdateData fail with user details', () => {
            before(() => {
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                usersDetailsRepository = {
                    findOne: () => userDetails,
                    update: () => userDetails,
                };

                updateUserDetailsService = new UpdateUserDetailsService({
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should throw an error', async () => {
                try {
                    await updateUserDetailsService.update({
                        userId: userDetails.userId,
                        payload: {
                            ...userDetails,
                        },
                    });
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal(
                        'Update User Details Info - forbidden field: userId exists in payload'
                    );
                    expect(err.name).to.be.equal('ForbiddenRequest');
                    expect(err.code).to.be.equal(HttpStatusCode.FORBIDDEN);
                }
            });
        });

        context('When validateUpdateData fail with xp and level', () => {
            before(() => {
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                usersDetailsRepository = {
                    findOne: () => userDetails,
                    update: () => userDetails,
                };

                updateUserDetailsService = new UpdateUserDetailsService({
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should throw an error for xp', async () => {
                try {
                    await updateUserDetailsService.update({
                        userId: userDetails.userId,
                        payload: {
                            xp: 100,
                        },
                    } as any);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Update User Details Info - forbidden field: xp exists in payload');
                    expect(err.name).to.be.equal('ForbiddenRequest');
                    expect(err.code).to.be.equal(HttpStatusCode.FORBIDDEN);
                }
            });
        });

        context('When validateUpdateData fail with cover', () => {
            before(() => {
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetailsToUpdate = {
                    ...DomainDataFaker.mocks.updateUserDetailsMock,
                    cover: userDetails.cover,
                };

                usersDetailsRepository = {
                    findOne: () => userDetails,
                    update: () => userDetails,
                };

                updateUserDetailsService = new UpdateUserDetailsService({
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should throw an error', async () => {
                try {
                    await updateUserDetailsService.update({
                        userId: userDetails.userId,
                        payload: userDetailsToUpdate,
                    });
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal(
                        'Update User Details Info - forbidden field: cover exists in payload'
                    );
                    expect(err.name).to.be.equal('ForbiddenRequest');
                    expect(err.code).to.be.equal(HttpStatusCode.FORBIDDEN);
                }
            });
        });

        context('When update fails because the user details no longer exist', () => {
            before(() => {
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetailsToUpdate = DomainDataFaker.mocks.updateUserDetailsMock;

                usersDetailsRepository = {
                    findOne: () => null,
                    update: () => userDetails,
                };

                updateUserDetailsService = new UpdateUserDetailsService({
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should throw a not found error', async () => {
                try {
                    await updateUserDetailsService.update({
                        userId: userDetails.userId,
                        payload: userDetailsToUpdate,
                    });
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('User does not exist');
                    expect(err.name).to.be.equal('NotFound');
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                }
            });
        });
    });
});

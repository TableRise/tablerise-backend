import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DeleteUserService from 'src/core/users/services/users/DeleteUserService';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { throwErrorAssert } from 'tests/support/throwErrorAssertion';

describe('Core :: Users :: Services :: DeleteUserService', () => {
    let deleteUsersService: DeleteUserService,
        usersRepository: any,
        usersDetailsRepository: any,
        user: UserInstance,
        message: string,
        code: number,
        userDetails: UserDetailInstance;

    const logger = (): void => {};

    context('#Delete', () => {
        context('When delete a user with success', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = user.userId;
                usersRepository = { findOne: () => user, delete: () => {} };
                usersDetailsRepository = { findOne: () => userDetails, delete: () => {} };

                deleteUsersService = new DeleteUserService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const mockDeleteUser = async (): Promise<boolean> => {
                    await deleteUsersService.delete(user.userId);
                    return true;
                };
                const deleted = await mockDeleteUser();
                expect(deleted).to.be.equal(true);
            });
        });

        context('When delete a user not exist', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = user.userId;
                message = 'User does not exist';
                code = HttpStatusCode.NOT_FOUND;
                userDetails.gameInfo.campaigns = ['Lavanda'];
                usersRepository = { findOne: () => {}, delete: () => {} };
                usersDetailsRepository = { findOne: () => {}, delete: () => {} };

                deleteUsersService = new DeleteUserService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should return HTTPRequestEroor: user-inexistent', async () => {
                try {
                    await deleteUsersService.delete(user.userId);
                } catch (error) {
                    throwErrorAssert(error as HttpRequestErrors, message, code);
                }
            });
        });

        context('When gameinfo campaing or character exists', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = user.userId;
                message = 'There is a campaing or character linked to this user';
                code = HttpStatusCode.UNAUTHORIZED;
                userDetails.gameInfo.campaigns = ['1st Mission'];
                userDetails.gameInfo.characters = ['Levi'];
                usersRepository = { findOne: () => user, delete: () => {} };
                usersDetailsRepository = { findOne: () => userDetails, delete: () => {} };

                deleteUsersService = new DeleteUserService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should return HTTPRequestEroor: linked-mandatory-data-when-delete', async () => {
                try {
                    await deleteUsersService.delete(user.userId);
                } catch (error) {
                    throwErrorAssert(error as HttpRequestErrors, message, code);
                }
            });
        });
    });
});

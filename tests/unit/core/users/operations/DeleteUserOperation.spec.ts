import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import sinon from 'sinon';
import DeleteUserOperation from 'src/core/users/operations/users/DeleteUserOperation';
import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import { UserDetailInstance } from 'src/domains/user/schemas/userDetailsValidationSchema';

describe('Core :: Users :: Operations :: DeleteUserOperation', () => {
    let deleteUserOperation: DeleteUserOperation,
        usersRepository: any,
        usersDetailsRepository: any,
        user: UserInstance,
        userDetails: UserDetailInstance;

    const logger = (): void => {};

    context('#Delete', () => {
        context('When serialize with success', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                serializer = {
                    postUser: () => user,
                    postUserDetails: () => userDetails,
                };

                usersRepository = {
                    find: () => [],
                };

                usersDetailsRepository = {};
                emailSender = {};


            });

            it('should return the correct result', async () => {

            });
        });

        context('When serialize with fails', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                const { nickname, ...userWithoutNickname } = user;
                const { lastName, ...userDetailsWithoutNickname } = userDetails;
                user = userWithoutNickname as UserInstance;
                userDetails = userDetailsWithoutNickname as UserDetailInstance;

                serializer = {
                    postUser: () => user,
                    postUserDetails: () => userDetails,
                };

                usersRepository = {
                    find: () => [user],
                };

                usersDetailsRepository = {};
                emailSender = {};

            });

            it('should throw an error', async () => {

            });
        });
    });

   
});

import GetUserByIdService from 'src/core/users/services/users/GetUserByIdService';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { RegisterUserResponse } from 'src/types/api/users/http/response';

describe('Core :: Users :: Services :: GetUserByIdService', () => {
    let getUserByIdService: GetUserByIdService,
        usersRepository: any,
        usersDetailsRepository: any,
        user: UserInstance,
        userDetails: UserDetailInstance,
        userReturned: RegisterUserResponse;

    const logger = (): void => {};

    context('#Get', () => {
        context('When get user by id with success', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = user.userId;
                userReturned = { ...user, details: userDetails };

                usersRepository = {
                    findOne: () => user,
                };

                usersDetailsRepository = {
                    findOne: () => userDetails,
                };

                getUserByIdService = new GetUserByIdService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const userTest = await getUserByIdService.get({
                    userId: user.userId,
                });

                expect(userTest.details.userId).to.be.equal(userTest.userId);
                expect(userTest).to.be.deep.equal(userReturned);
            });
        });
    });
});

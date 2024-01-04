import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import sinon from 'sinon';
import GetUserByIdOperation from 'src/core/users/operations/users/GetUserByIdOperation';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import { RegisterUserResponse } from 'src/types/users/requests/Response';

describe('Core :: Users :: Operations :: GetUserByIdOperation', () => {
    let getUserByIdOperation: GetUserByIdOperation,
        getUserByIdService: any,
        user: UserInstance,
        userReturned: RegisterUserResponse;

    const logger = (): void => {};

    context('When get user by id with success', () => {
        before(() => {
            user = DomainDataFaker.generateUsersJSON()[0];

            userReturned = {
                ...user,
                details: DomainDataFaker.generateUserDetailsJSON()[0],
            };

            userReturned.details.userId = user.userId;

            getUserByIdService = {
                get: sinon.spy(() => userReturned),
            };

            getUserByIdOperation = new GetUserByIdOperation({
                getUserByIdService,
                logger,
            });
        });

        it('should return the correct user', async () => {
            const userTest = await getUserByIdOperation.execute({ userId: user.userId });

            expect(getUserByIdService.get).to.have.been.called();
            expect(getUserByIdService.get).to.have.been.calledWith({
                userId: user.userId,
            });
            expect(userTest).to.be.deep.equal(userReturned);
        });
    });
});

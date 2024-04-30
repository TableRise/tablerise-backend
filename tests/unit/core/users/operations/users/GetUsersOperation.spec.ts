import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import sinon from 'sinon';
import GetUsersOperation from 'src/core/users/operations/users/GetUsersOperation';

describe('Core :: Users :: Operations :: GetUsersOperation', () => {
    let getUsersOperation: GetUsersOperation,
        getUsersService: any,
        users: any,
        usersWithDetails: any;

    const logger = (): void => {};

    context('When get users with success', () => {
        before(() => {
            users = DomainDataFaker.generateUsersJSON();

            usersWithDetails = users.map((user: any, i: number) => ({
                ...user,
                details: DomainDataFaker.generateUserDetailsJSON()[i],
            }));

            getUsersService = {
                get: sinon.spy(() => usersWithDetails),
            };

            getUsersOperation = new GetUsersOperation({
                getUsersService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const userTest = await getUsersOperation.execute();

            expect(getUsersService.get).to.have.been.called();
            expect(userTest).to.be.deep.equal(usersWithDetails);
        });
    });
});

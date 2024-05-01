import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import sinon from 'sinon';
import DeleteUserOperation from 'src/core/users/operations/users/DeleteUserOperation';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';

describe('Core :: Users :: Operations :: DeleteUserOperation', () => {
    let deleteUserOperation: DeleteUserOperation,
        deleteUserService: any,
        user: UserInstance,
        userDetails: UserDetailInstance;

    const logger = (): void => {};

    context('#Delete', () => {
        context('When delete a user', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = user.userId;
                deleteUserService = { delete: sinon.spy(() => {}) };
                deleteUserOperation = new DeleteUserOperation({
                    deleteUserService,
                    logger,
                });
            });

            it('should execute with success', async () => {
                await deleteUserOperation.execute(user.userId);

                expect(deleteUserService.delete).to.have.been.called();
                expect(deleteUserService.delete).to.have.been.calledWith(user.userId);
            });
        });
    });
});

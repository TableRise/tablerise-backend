import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import sinon from 'sinon';
import DeleteUserOperation from 'src/core/users/operations/users/DeleteUserOperation';
import User from '@tablerise/database-management/dist/src/interfaces/User';
import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';

describe('Core :: Users :: Operations :: DeleteUserOperation', () => {
    let deleteUserOperation: DeleteUserOperation,
        deleteUserService: any,
        user: User,
        userDetails: UserDetail;

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

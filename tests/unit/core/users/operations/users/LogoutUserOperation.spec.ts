import sinon from 'sinon';
import LogoutUserOperation from 'src/core/users/operations/users/LogoutUserOperation';

describe('Core :: Users :: Operations :: LogoutUserOperation', () => {
    let logoutUserOperation: LogoutUserOperation, logoutUserService: any;

    const logger = (): void => {};

    context('When a user is logged out', () => {
        context('And data is correct', () => {
            before(() => {
                logoutUserService = { addToForbiddenList: sinon.spy(() => {}) };
                logoutUserOperation = new LogoutUserOperation({
                    logoutUserService,
                    logger,
                });
            });

            it('should execute with success', async () => {
                await logoutUserOperation.execute('123');
                expect(logoutUserService.addToForbiddenList).to.have.been.calledWith(
                    '123'
                );
            });
        });
    });
});

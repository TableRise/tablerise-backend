import sinon from 'sinon';
import LogoutUserService from 'src/core/users/services/users/LogoutUserService';

describe('Core :: Users :: Operations :: LogoutUserService', () => {
    let logoutUserService: LogoutUserService,
        tokenForbidden: any;

    const logger = (): void => {};

    context('#AddToForbiddenList', () => {
        context('When a user is logged out', () => {
            before(() => {
                tokenForbidden = { addToken: sinon.spy(() => {}) };
                logoutUserService = new LogoutUserService({
                    tokenForbidden,
                    logger,
                });
            });

            it('should execute with success', async () => {
                await logoutUserService.addToForbiddenList('123');
                expect(tokenForbidden.addToken).to.have.been.calledWith('123');
            });
        });
    });
});

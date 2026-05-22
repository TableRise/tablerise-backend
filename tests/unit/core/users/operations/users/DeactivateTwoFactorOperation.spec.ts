import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import sinon from 'sinon';
import DeactivateTwoFactorOperation from 'src/core/users/operations/users/DeactivateTwoFactorOperation';

describe('Core :: Users :: Operations :: DeactivateTwoFactorOperation', () => {
    let deactivateTwoFactorOperation: DeactivateTwoFactorOperation, deactivateTwoFactorService: any, user: any;

    const logger = (): void => {};

    context('When deactivate two factor with success', () => {
        before(() => {
            user = DomainDataFaker.generateUsersJSON()[0];

            deactivateTwoFactorService = {
                deactivate: sinon.spy(() => user),
                save: sinon.spy(() => undefined),
            };

            deactivateTwoFactorOperation = new DeactivateTwoFactorOperation({
                deactivateTwoFactorService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            await deactivateTwoFactorOperation.execute('userId');

            expect(deactivateTwoFactorService.deactivate).to.have.been.called();
            expect(deactivateTwoFactorService.save).to.have.been.calledWith(user);
        });
    });
});

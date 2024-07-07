import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import sinon from 'sinon';
import ActivateTwoFactorOperation from 'src/core/users/operations/users/ActivateTwoFactorOperation';

describe('Core :: Users :: Operations :: ActivateTwoFactorOperation', () => {
    let activateTwoFactorOperation: ActivateTwoFactorOperation,
        activateTwoFactorService: any,
        user: any,
        userDetails: any;

    const logger = (): void => {};

    context('When get users with success', () => {
        before(() => {
            user = DomainDataFaker.generateUsersJSON()[0];

            userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            activateTwoFactorService = {
                activate: sinon.spy(() => ({
                    user,
                    userDetails,
                })),
                save: sinon.spy(() => ({
                    active: true,
                })),
            };

            activateTwoFactorOperation = new ActivateTwoFactorOperation({
                activateTwoFactorService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const userTest = await activateTwoFactorOperation.execute('userId');

            expect(activateTwoFactorService.activate).to.have.been.called();
            expect(activateTwoFactorService.save).to.have.been.called();
            expect(userTest).to.be.deep.equal({ active: true });
        });
    });
});

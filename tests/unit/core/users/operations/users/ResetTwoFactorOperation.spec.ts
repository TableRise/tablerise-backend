import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import sinon from 'sinon';
import ResetTwoFactorOperation from 'src/core/users/operations/users/ResetTwoFactorOperation';

describe('Core :: Users :: Operations :: ResetTwoFactorOperation', () => {
    let resetTwoFactorOperation: ResetTwoFactorOperation,
        resetTwoFactorService: any,
        user: any,
        userDetails: any;

    const logger = (): void => {};

    context('When reset two factor with success', () => {
        before(() => {
            user = DomainDataFaker.generateUsersJSON()[0];

            userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            resetTwoFactorService = {
                reset: sinon.spy(() => ({
                    user,
                    userDetails,
                })),
                save: sinon.spy(() => ({
                    active: true,
                })),
            };

            resetTwoFactorOperation = new ResetTwoFactorOperation({
                resetTwoFactorService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const userTest = await resetTwoFactorOperation.execute('userId');

            expect(resetTwoFactorService.reset).to.have.been.called();
            expect(resetTwoFactorService.save).to.have.been.called();
            expect(userTest).to.be.deep.equal({active: true});
        });
    });
});

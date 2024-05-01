import Sinon from 'sinon';
import GoogleOperation from 'src/core/users/operations/oauth/GoogleOperation';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Core :: Users :: Operations :: OAuth :: GoogleOperation', () => {
    let googleOperation: GoogleOperation,
        googleProfile: any,
        user: UserInstance,
        userDetails: UserDetailInstance,
        oAuthService: any;

    const logger = (): void => {};

    context('#execute', () => {
        context('When a Google profile is registered', () => {
            before(() => {
                googleProfile = DomainDataFaker.generateGoogleProfileJSON()[0];
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                oAuthService = {
                    serialize: Sinon.spy(() => ({
                        username: googleProfile.displayName,
                    })),
                    enrichment: Sinon.spy(() => ({
                        username: googleProfile,
                        tag: '#4564',
                    })),
                    saveUser: Sinon.spy(() => ({
                        userSaved: user,
                        userDetailsSaved: userDetails,
                    })),
                };

                googleOperation = new GoogleOperation({
                    oAuthService,
                    logger,
                });
            });

            it('should call correct methods', async () => {
                const googleProfileCompleted = await googleOperation.execute(
                    googleProfile
                );
                expect(oAuthService.serialize).to.have.been.calledWith(googleProfile);
                expect(oAuthService.enrichment).to.have.been.called();
                expect(oAuthService.saveUser).to.have.been.called();
                expect(googleProfileCompleted).to.be.deep.equal({
                    ...user,
                    details: userDetails,
                });
            });
        });

        context('When a Google profile is logged in', () => {
            before(() => {
                googleProfile = DomainDataFaker.generateGoogleProfileJSON()[0];
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                oAuthService = {
                    serialize: Sinon.spy(() => 'test'),
                    enrichment: Sinon.spy(() => ({
                        username: googleProfile,
                        tag: '#4564',
                    })),
                    saveUser: Sinon.spy(() => ({
                        userSaved: user,
                        userDetailsSaved: userDetails,
                    })),
                };

                googleOperation = new GoogleOperation({
                    oAuthService,
                    logger,
                });
            });

            it('should call correct methods', async () => {
                const googleProfileCompleted = await googleOperation.execute(
                    googleProfile
                );
                expect(googleProfileCompleted).to.be.equal('test');
            });
        });
    });
});

import Sinon from 'sinon';
import FacebookOperation from 'src/core/users/operations/oauth/FacebookOperation';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Core :: Users :: Operations :: OAuth :: FacebookOperation', () => {
    let facebookOperation: FacebookOperation,
        facebookProfile: any,
        user: UserInstance,
        userDetails: UserDetailInstance,
        oAuthService: any;

    const logger = (): void => {};

    context('#execute', () => {
        context('When a Facebook profile is registered', () => {
            before(() => {
                facebookProfile = DomainDataFaker.generateFacebookProfileJSON()[0];
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                oAuthService = {
                    serialize: Sinon.spy(() => ({
                        username: facebookProfile.displayName,
                    })),
                    enrichment: Sinon.spy(() => ({
                        username: facebookProfile,
                        tag: '#4564',
                    })),
                    saveUser: Sinon.spy(() => ({
                        userSaved: user,
                        userDetailsSaved: userDetails,
                    })),
                };

                facebookOperation = new FacebookOperation({
                    oAuthService,
                    logger,
                });
            });

            it('should call correct methods', async () => {
                const facebookProfileCompleted = await facebookOperation.execute(
                    facebookProfile
                );
                expect(oAuthService.serialize).to.have.been.calledWith(facebookProfile);
                expect(oAuthService.enrichment).to.have.been.called();
                expect(oAuthService.saveUser).to.have.been.called();
                expect(facebookProfileCompleted).to.be.deep.equal({
                    ...user,
                    details: userDetails,
                });
            });
        });

        context('When a Facebook profile is logged in', () => {
            before(() => {
                facebookProfile = DomainDataFaker.generateFacebookProfileJSON()[0];
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                oAuthService = {
                    serialize: Sinon.spy(() => 'test'),
                    enrichment: Sinon.spy(() => ({
                        username: facebookProfile,
                        tag: '#4564',
                    })),
                    saveUser: Sinon.spy(() => ({
                        userSaved: user,
                        userDetailsSaved: userDetails,
                    })),
                };

                facebookOperation = new FacebookOperation({
                    oAuthService,
                    logger,
                });
            });

            it('should call correct methods', async () => {
                const facebookProfileCompleted = await facebookOperation.execute(
                    facebookProfile
                );
                expect(facebookProfileCompleted).to.be.equal('test');
            });
        });
    });
});

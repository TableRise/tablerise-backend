import Sinon from 'sinon';
import DiscordOperation from 'src/core/users/operations/oauth/DiscordOperation';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Core :: Users :: Operations :: OAuth :: DiscordOperation', () => {
    let discordOperation: DiscordOperation,
        discordProfile: any,
        user: UserInstance,
        userDetails: UserDetailInstance,
        oAuthService: any;

    const logger = (): void => {};

    context('#execute', () => {
        context('When a Discord profile is registered', () => {
            before(() => {
                discordProfile = DomainDataFaker.generateDiscordProfileJSON()[0];
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                oAuthService = {
                    serialize: Sinon.spy(() => ({
                        username: discordProfile.username,
                    })),
                    enrichment: Sinon.spy(() => ({
                        username: discordProfile,
                        tag: '#4564',
                    })),
                    saveUser: Sinon.spy(() => ({
                        userSaved: user,
                        userDetailsSaved: userDetails,
                    })),
                };

                discordOperation = new DiscordOperation({
                    oAuthService,
                    logger,
                });
            });

            it('should call correct methods', async () => {
                const discordProfileCompleted = await discordOperation.execute(
                    discordProfile
                );
                expect(oAuthService.serialize).to.have.been.calledWith(discordProfile);
                expect(oAuthService.enrichment).to.have.been.called();
                expect(oAuthService.saveUser).to.have.been.called();
                expect(discordProfileCompleted).to.be.deep.equal({
                    ...user,
                    details: userDetails,
                });
            });
        });

        context('When a Discord profile is logged in', () => {
            before(() => {
                discordProfile = DomainDataFaker.generateDiscordProfileJSON()[0];
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                oAuthService = {
                    serialize: Sinon.spy(() => 'test'),
                    enrichment: Sinon.spy(() => ({
                        username: discordProfile,
                        tag: '#4564',
                    })),
                    saveUser: Sinon.spy(() => ({
                        userSaved: user,
                        userDetailsSaved: userDetails,
                    })),
                };

                discordOperation = new DiscordOperation({
                    oAuthService,
                    logger,
                });
            });

            it('should have correct return', async () => {
                const discordProfileCompleted = await discordOperation.execute(
                    discordProfile
                );
                expect(discordProfileCompleted).to.be.equal('test');
            });
        });
    });
});

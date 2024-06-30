import Sinon from 'sinon';
import DiscordOperation from 'src/core/users/operations/oauth/DiscordOperation';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Core :: Users :: Operations :: OAuth :: DiscordOperation', () => {
    let discordOperation: DiscordOperation,
        usersRepository: any,
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

                usersRepository = {
                    find: () => [],
                };

                oAuthService = {
                    serialize: Sinon.spy(() => ({
                        userSerialized: user,
                        userDetailsSerialized: userDetails,
                    })),
                    enrichment: Sinon.spy(() => ({
                        userEnriched: user,
                        userDetailsEnriched: userDetails,
                    })),
                    saveUser: Sinon.spy(() => ({
                        userSaved: user,
                        userDetailsSaved: userDetails,
                    })),
                    login: Sinon.spy(() => ({
                        token: '123',
                    })),
                };

                discordOperation = new DiscordOperation({
                    oAuthService,
                    usersRepository,
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
                expect(oAuthService.login).to.have.been.called();
                expect(discordProfileCompleted).to.be.deep.equal({
                    ...user,
                    details: userDetails,
                    token: '123',
                });
            });
        });

        context('When a Discord profile is logged in', () => {
            before(() => {
                discordProfile = DomainDataFaker.generateDiscordProfileJSON()[0];
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                usersRepository = {
                    find: () => [user],
                };

                oAuthService = {
                    serialize: Sinon.spy(() => ({
                        userSerialized: user,
                        userDetailsSerialized: userDetails,
                    })),
                    enrichment: Sinon.spy(() => 'test'),
                    saveUser: Sinon.spy(() => 'test'),
                    login: Sinon.spy(() => ({
                        token: '123',
                    })),
                };

                discordOperation = new DiscordOperation({
                    oAuthService,
                    usersRepository,
                    logger,
                });
            });

            it('should have correct return', async () => {
                const discordProfileCompleted = await discordOperation.execute(
                    discordProfile
                );

                expect(oAuthService.serialize).to.have.been.called();
                expect(oAuthService.enrichment).to.not.have.been.called();
                expect(oAuthService.saveUser).to.not.have.been.called();
                expect(discordProfileCompleted).to.be.deep.equal({ token: '123' });
            });
        });
    });
});

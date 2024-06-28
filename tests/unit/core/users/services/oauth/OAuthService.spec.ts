import Sinon from 'sinon';
import OAuthService from 'src/core/users/services/oauth/OAuthService';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Core :: Users :: Services :: OAuth :: OAuthService', () => {
    let oAuthService: OAuthService,
        payload: any,
        usersRepository: any,
        usersDetailsRepository: any,
        user: UserInstance,
        userDetails: UserDetailInstance,
        serializer: any;

    const logger = (): void => {};

    context('#serialize', () => {
        context('When object is passed through oAuth serialize', () => {
            const username = 'testUserN';
            const email = 'testUserN@email.com';

            before(() => {
                payload = {};

                usersRepository = {
                    find: Sinon.spy(() => []),
                };

                usersDetailsRepository = {};

                serializer = {
                    externalUser: Sinon.spy(() => ({ username })),
                    postUser: Sinon.spy(() => ({ username, email })),
                    postUserDetails: Sinon.spy(() => ({})),
                };

                oAuthService = new OAuthService({
                    usersRepository,
                    usersDetailsRepository,
                    serializer,
                    logger,
                });
            });

            it('should call correct methods', async () => {
                const oAuthSerialized = await oAuthService.serialize(payload);

                expect(oAuthSerialized).to.have.property('userSerialized');
                expect(oAuthSerialized).to.have.property('userDetailsSerialized');
                expect(oAuthSerialized.userSerialized).to.be.deep.equal({
                    username,
                    email,
                });
                expect(oAuthSerialized.userDetailsSerialized).to.be.deep.equal({});
            });
        });
    });

    context('#enrichment', () => {
        const provider = 'google';

        context('When enrich an object', () => {
            before(() => {
                user = {} as UserInstance;
                userDetails = {} as UserDetailInstance;

                usersRepository = {};
                usersDetailsRepository = {};
                serializer = {};

                oAuthService = new OAuthService({
                    usersRepository,
                    usersDetailsRepository,
                    serializer,
                    logger,
                });
            });

            it('should have correct properties', async () => {
                const userEnriched = await oAuthService.enrichment(
                    { user, userDetails },
                    provider
                );

                expect(userEnriched.userEnriched).to.have.property('tag');
                expect(userEnriched.userEnriched).to.have.property('createdAt');
                expect(userEnriched.userEnriched).to.have.property('updatedAt');
                expect(userEnriched.userEnriched).to.have.property('password');
                expect(userEnriched.userEnriched).to.have.property('twoFactorSecret');
                expect(userEnriched.userEnriched).to.have.property('inProgress');
                expect(userEnriched.userDetailsEnriched).to.have.property(
                    'secretQuestion'
                );
            });
        });
    });

    context('#saveUser', () => {
        context('When the user is saved after processment', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                usersRepository = {
                    create: Sinon.spy(() => user),
                };

                usersDetailsRepository = {
                    create: Sinon.spy(() => userDetails),
                };

                serializer = {};

                oAuthService = new OAuthService({
                    usersRepository,
                    usersDetailsRepository,
                    serializer,
                    logger,
                });
            });

            it('should return correct result and call methods', async () => {
                const usersSaved = await oAuthService.saveUser({ user, userDetails });
                expect(usersSaved.userSaved).to.be.equal(user);
                expect(usersSaved.userDetailsSaved).to.be.equal(userDetails);
            });
        });
    });
});

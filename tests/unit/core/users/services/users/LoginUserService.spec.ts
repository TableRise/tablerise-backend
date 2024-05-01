import LoginUserService from 'src/core/users/services/users/LoginUserService';
import JWTGenerator from 'src/domains/users/helpers/JWTGenerator';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Core :: Users :: Services :: LoginUserService', () => {
    let loginUserService: LoginUserService,
        usersDetailsRepository: any,
        user: UserInstance,
        userDetails: UserDetailInstance;

    const logger = (): void => {};

    context('#EnrichToken', () => {
        context('When a user is logging in', () => {
            before(() => {
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                user = DomainDataFaker.generateUsersJSON()[0];

                usersDetailsRepository = {
                    findOne: () => userDetails,
                };

                loginUserService = new LoginUserService({
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should enrich the token with success', async () => {
                const token = JWTGenerator.generate(user);
                const enrichedToken = await loginUserService.enrichToken(token);

                expect(enrichedToken.userId).to.be.equal(user.userId);
                expect(enrichedToken.providerId).to.be.equal(user.providerId);
                expect(enrichedToken.username).to.be.equal(`${user.nickname}${user.tag}`);
                expect(enrichedToken.picture?.id).to.be.equal(user.picture?.id);
                expect(enrichedToken.picture?.link).to.be.equal(user.picture?.link);
                expect(enrichedToken.picture?.uploadDate).to.be.equal(
                    user.picture?.uploadDate.toISOString()
                );
                expect(enrichedToken.fullname).to.be.equal(
                    `${userDetails.firstName} ${userDetails.lastName}`
                );
            });
        });
    });

    context('#SetCookieOptions', () => {
        context('When a user is logging in', () => {
            before(() => {
                usersDetailsRepository = {};

                loginUserService = new LoginUserService({
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should set cookie options', () => {
                const cookieOptions = loginUserService.setCookieOptions();

                expect(cookieOptions).to.have.property('maxAge');
                expect(cookieOptions).to.have.property('httpOnly');
                expect(cookieOptions).to.have.property('secure');
                expect(cookieOptions).to.have.property('sameSite');
            });
        });
    });
});

import LoginUserService from 'src/core/users/services/users/LoginUserService';
import JWTGenerator from 'src/domains/users/helpers/JWTGenerator';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';

describe('Core :: Users :: Services :: LoginUserService', () => {
    let loginUserService: LoginUserService, usersDetailsRepository: any, user: User, userDetails: UserDetail;

    const logger = (): void => {};

    context('#EnrichToken', () => {
        context('When a user is logging in', () => {
            before(() => {
                process.env.JWT_SECRET = 'test-secret-key-for-unit-tests';

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
                expect(enrichedToken.picture?.uploadDate).to.be.equal(user.picture?.uploadDate);
                expect(enrichedToken.fullname).to.be.equal(`${userDetails.firstName} ${userDetails.lastName}`);
            });

            it('should throw when the user detail does not exist', async () => {
                usersDetailsRepository = {
                    findOne: () => null,
                };

                loginUserService = new LoginUserService({
                    usersDetailsRepository,
                    logger,
                });

                try {
                    await loginUserService.enrichToken(JWTGenerator.generate(user));
                    expect.fail('Expected missing user detail error');
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.equal('User does not exist');
                    expect(err.code).to.equal(HttpStatusCode.NOT_FOUND);
                    expect(err.name).to.equal(getErrorName(HttpStatusCode.NOT_FOUND));
                }
            });
        });
    });

    context('#SetCookieOptions', () => {
        context('When a user is logging in', () => {
            before(() => {
                delete process.env.NODE_ENV;
                delete process.env.COOKIE_SECURE;
            });

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
                expect(cookieOptions.secure).to.be.equal(false);
                expect(cookieOptions.sameSite).to.be.equal('lax');
            });
        });

        context('When COOKIE_SECURE is set to yes', () => {
            before(() => {
                process.env.COOKIE_SECURE = 'yes';

                usersDetailsRepository = {};

                loginUserService = new LoginUserService({
                    usersDetailsRepository,
                    logger,
                });
            });

            after(() => {
                delete process.env.COOKIE_SECURE;
            });

            it('should set secure to true', () => {
                const cookieOptions = loginUserService.setCookieOptions();

                expect(cookieOptions.secure).to.be.equal(true);
                expect(cookieOptions.sameSite).to.be.equal('none');
            });
        });

        context('When running in production', () => {
            before(() => {
                process.env.NODE_ENV = 'production';
                delete process.env.COOKIE_SECURE;

                usersDetailsRepository = {};

                loginUserService = new LoginUserService({
                    usersDetailsRepository,
                    logger,
                });
            });

            after(() => {
                delete process.env.NODE_ENV;
            });

            it('should force secure cookies with sameSite none', () => {
                const cookieOptions = loginUserService.setCookieOptions();

                expect(cookieOptions.secure).to.be.equal(true);
                expect(cookieOptions.sameSite).to.be.equal('none');
            });
        });
    });
});

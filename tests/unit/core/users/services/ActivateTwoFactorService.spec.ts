import ActivateTwoFactorService from 'src/core/users/services/users/ActivateTwoFactorService';
import { UserDetailInstance } from 'src/domains/user/schemas/userDetailsValidationSchema';
import TwoFactorHandler from 'src/domains/common/helpers/TwoFactorHandler';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import configs from 'src/infra/configs';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';

describe('Core :: Users :: Services :: ActivateTwoFactorService', () => {
    let activateTwoFactorService: ActivateTwoFactorService,
        usersRepository: any,
        usersDetailsRepository: any,
        twoFactorHandler: TwoFactorHandler,
        user: UserInstance,
        userDetails: UserDetailInstance,
        httpRequestErrors: HttpRequestErrors;

    const logger = (): void => {};

    context('#activate', () => {
        context('When activate an user two factor with success', () => {
            beforeEach(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = user.userId;

                usersRepository = {
                    findOne: () => user,
                };

                usersDetailsRepository = {
                    findOne: () => userDetails,
                };

                twoFactorHandler = new TwoFactorHandler({ configs, logger });

                activateTwoFactorService = new ActivateTwoFactorService({
                    usersRepository,
                    usersDetailsRepository,
                    twoFactorHandler,
                    httpRequestErrors,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const userTest = await activateTwoFactorService.activate('userId', false);

                expect(userTest.user).to.be.equal(user);
                expect(userTest.userDetails).to.be.equal(userDetails);
            });
        });

        context('When activate an user two factor fail | 2fa-no-active', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = user.userId;

                usersRepository = {
                    findOne: () => user,
                };

                usersDetailsRepository = {
                    findOne: () => userDetails,
                };

                twoFactorHandler = new TwoFactorHandler({ configs, logger });

                activateTwoFactorService = new ActivateTwoFactorService({
                    usersRepository,
                    usersDetailsRepository,
                    twoFactorHandler,
                    httpRequestErrors,
                    logger,
                });
            });

            it('should throw an error', async () => {
                try {
                    await activateTwoFactorService.activate('userId', true);

                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('2FA not enabled for this user');
                    expect(err.name).to.be.equal('BadRequest');
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                }
            });
        });

        context('When activate an user two factor fail | 2fa-already-active', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = user.userId;
                user.twoFactorSecret.active = true;

                usersRepository = {
                    findOne: () => user,
                };

                usersDetailsRepository = {
                    findOne: () => userDetails,
                };

                twoFactorHandler = new TwoFactorHandler({ configs, logger });

                activateTwoFactorService = new ActivateTwoFactorService({
                    usersRepository,
                    usersDetailsRepository,
                    twoFactorHandler,
                    httpRequestErrors,
                    logger,
                });
            });

            it('should throw an error', async () => {
                try {
                    await activateTwoFactorService.activate('userId', false);

                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal(
                        '2FA is already enabled for this user'
                    );
                    expect(err.name).to.be.equal('BadRequest');
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                }
            });
        });
    });

    context('#save', () => {
        context('When save an user two factor with success', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                userDetails.userId = user.userId;

                usersRepository = {
                    update: () => user,
                };

                usersDetailsRepository = {
                    update: () => userDetails,
                };

                twoFactorHandler = new TwoFactorHandler({ configs, logger });

                activateTwoFactorService = new ActivateTwoFactorService({
                    usersRepository,
                    usersDetailsRepository,
                    twoFactorHandler,
                    httpRequestErrors,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const result = await activateTwoFactorService.save({
                    user,
                    userDetails,
                });

                expect(result.active).to.be.equal(false);
            });
        });
    });
});

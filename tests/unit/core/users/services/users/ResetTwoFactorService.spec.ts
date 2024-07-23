import path from 'path';
import ResetTwoFactorService from 'src/core/users/services/users/ResetTwoFactorService';
import TwoFactorHandler from 'src/domains/common/helpers/TwoFactorHandler';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';

const configs = require(path.join(process.cwd(), 'tablerise.environment.js'));

describe('Core :: Users :: Services :: ResetTwoFactorService', () => {
    let resetTwoFactorService: ResetTwoFactorService,
        usersRepository: any,
        usersDetailsRepository: any,
        twoFactorHandler: TwoFactorHandler,
        user: UserInstance,
        httpRequestErrors: HttpRequestErrors;

    const logger = (): void => {};

    context('#reset', () => {
        context('When reset an user two factor with success', () => {
            beforeEach(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                usersRepository = {
                    findOne: () => user,
                };

                twoFactorHandler = new TwoFactorHandler({ configs, logger });

                resetTwoFactorService = new ResetTwoFactorService({
                    usersRepository,
                    usersDetailsRepository,
                    twoFactorHandler,
                    httpRequestErrors,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const userTest = await resetTwoFactorService.reset('userId');
                expect(userTest).to.be.deep.equal(user);
            });
        });
    });

    context('#save', () => {
        context('When save an user two factor with success', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                user.twoFactorSecret.active = true;

                usersRepository = {
                    update: () => user,
                };

                twoFactorHandler = new TwoFactorHandler({ configs, logger });

                resetTwoFactorService = new ResetTwoFactorService({
                    usersRepository,
                    usersDetailsRepository,
                    twoFactorHandler,
                    httpRequestErrors,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const result = await resetTwoFactorService.save(user);
                expect(result.active).to.be.equal(true);
            });
        });
    });
});

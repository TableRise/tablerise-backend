import ActivateSecretQuestionService from 'src/core/users/services/users/ActivateSecretQuestionService';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import sinon from 'sinon';

describe('Core :: Users :: Services :: ActivateSecretQuestionService', () => {
    let activateSecretQuestionService: ActivateSecretQuestionService,
        usersRepository: any,
        usersDetailsRepository: any,
        user: UserInstance,
        userDetails: UserDetailInstance;

    const logger = (): void => {};

    context('#activate', () => {
        context('When activate an user secret question with success', () => {
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

                activateSecretQuestionService = new ActivateSecretQuestionService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const payload = {
                    question: 'newQuestion',
                    answer: 'newAnswer',
                };
                const user = await activateSecretQuestionService.activate({
                    userId: 'userId',
                    payload,
                });

                expect(user.twoFactorSecret.active).to.be.equal(false);
            });
        });

    });

    context('#save', () => {
        context('When save an user secret question with success', () => {
            beforeEach(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                user.twoFactorSecret.active = false;

                usersRepository = {
                    update: sinon.spy(() => user),
                };

                activateSecretQuestionService = new ActivateSecretQuestionService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const twoFactorSecret = await activateSecretQuestionService.save(user);

                expect(usersRepository.update).to.have.been.called();
                expect (twoFactorSecret.active).to.be.equal(false);
            });
        });
    });
});

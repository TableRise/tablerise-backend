import ActivateSecretQuestionService from 'src/core/users/services/users/ActivateSecretQuestionService';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import sinon from 'sinon';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';

describe('Core :: Users :: Services :: ActivateSecretQuestionService', () => {
    let activateSecretQuestionService: ActivateSecretQuestionService,
        usersRepository: any,
        usersDetailsRepository: any,
        user: UserInstance,
        payload: any,
        userDetails: UserDetailInstance;

    const logger = (): void => {};

    context('#activate', () => {
        context('When activate an user secret question with success', () => {
            beforeEach(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = user.userId;
                payload = {
                    question: 'newQuestion',
                    answer: 'newAnswer',
                };
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

                const user = await activateSecretQuestionService.activate({
                    userId: 'userId',
                    payload,
                });

                expect(user.twoFactorSecret.active).to.be.equal(false);
            });
        });

        context('When activate an user secret question fail', () => {
            beforeEach(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = user.userId;
                payload = {
                    question: 'newQuestion',
                    answer: 'newAnswer',
                };
                usersRepository = {
                    findOne: sinon.spy(() => {})
                };

                activateSecretQuestionService = new ActivateSecretQuestionService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should throw an error if user is missing - user-inexistent', async () => {
                try {
                    await activateSecretQuestionService.activate({
                        userId: '123',
                        payload,
                    });
                    expect(usersRepository.findOne).to.have.been.called();
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('User does not exist');
                    expect(err.name).to.be.equal(getErrorName(HttpStatusCode.NOT_FOUND));
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                }
            });
        });

        context('When activate an user secret question fail', () => {
            beforeEach(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = user.userId;
                userDetails.secretQuestion = null;
                payload = {
                    question: 'newQuestion',
                    answer: 'newAnswer',
                };
                usersRepository = {
                    findOne: () => user
                };

                usersDetailsRepository = {
                    findOne: sinon.spy(() => userDetails)
                }
                activateSecretQuestionService = new ActivateSecretQuestionService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should throw an error if - incorrect-secret-question', async () => {
                try {
                    await activateSecretQuestionService.activate({
                        userId: '123',
                        payload,
                    });
                    expect(usersRepository.findOne).to.have.been.called();
                    expect(usersDetailsRepository.findOne).to.have.been.called();
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Secret question is incorrect');
                    expect(err.name).to.be.equal(getErrorName(HttpStatusCode.UNAUTHORIZED));
                    expect(err.code).to.be.equal(HttpStatusCode.UNAUTHORIZED);
                }
            });
        });

        context('When activate an user secret question fail', () => {
            beforeEach(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = user.userId;
                payload = null;
                usersRepository = {
                    findOne: () => user
                };
                usersDetailsRepository = {
                    findOne: () => userDetails
                }

                activateSecretQuestionService = new ActivateSecretQuestionService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should throw an error if - new-structure-secret-question-missing', async () => {

                try {
                    await activateSecretQuestionService.activate({
                        userId: '123',
                        payload,
                    });
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Structure of new for new question and answer is missing');
                    expect(err.name).to.be.equal(getErrorName(HttpStatusCode.BAD_REQUEST));
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                }
            });
        });

        // context('When activate an user secret question fail', () => {
        //     beforeEach(() => {
        //         user = DomainDataFaker.generateUsersJSON()[0];
        //         userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        //         userDetails.userId = user.userId;
        //         payload = {
        //             question: 'newQuestion',
        //             answer: 'newAnswer',
        //         };
        //         usersRepository = {
        //             findOne: () =>  user, 
        //         };

        //         usersDetailsRepository = {
        //             findOne: sinon.spy(() => {})
        //         };

        //         activateSecretQuestionService = new ActivateSecretQuestionService({
        //             usersRepository,
        //             usersDetailsRepository,
        //             logger,
        //         });
        //     });


        //     it('should throw an error if - incorrect-secret-question', async () => {
        //         try {
        //             await activateSecretQuestionService.activate({
        //                 userId: '123',
        //                 payload,
        //             });
        //             expect(usersDetailsRepository.findOne).to.have.been.called();
        //             expect('it should not be here').to.be.equal(false);
        //         } catch (error) {
        //             const err = error as HttpRequestErrors;
        //             expect(err.message).to.be.equal('Secret question is incorrect');
        //             expect(err.name).to.be.equal(getErrorName(HttpStatusCode.UNAUTHORIZED));
        //             expect(err.code).to.be.equal(HttpStatusCode.UNAUTHORIZED);
        //         }
        //     });
        // });
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

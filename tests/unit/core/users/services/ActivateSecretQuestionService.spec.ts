import ActivateSecretQuestionService from 'src/core/users/services/users/ActivateSecretQuestionService';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
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
                const userTest = await activateSecretQuestionService.activate({
                    userId: 'userId',
                    payload,
                });

                expect(userTest.user).to.be.equal(user);
                expect(userTest.userDetails.secretQuestion?.question).to.be.equal(
                    'newQuestion'
                );
                expect(userTest.userDetails.secretQuestion?.answer).to.be.equal('newAnswer');
            });
        });

        context('When update an user secret question with success', () => {
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
                    question: 'oldQuestion',
                    answer: 'oldAnswer',
                    new: {
                        question: 'newQuestion',
                        answer: 'newAnswer',
                    },
                };
                const userTest = await activateSecretQuestionService.activate(
                    {
                        userId: 'userId',
                        payload,
                    },
                    true
                );

                expect(userTest.user).to.be.equal(user);
                expect(userTest.userDetails.secretQuestion?.question).to.be.equal(
                    'newQuestion'
                );
                expect(userTest.userDetails.secretQuestion?.answer).to.be.equal('newAnswer');
            });
        });

        context('When update an user secret question fail: incorrect-secret-question', () => {
            beforeEach(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = user.userId;
                userDetails.secretQuestion = null;

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
                try {
                    const payload = {
                        question: 'oldQuestion',
                        answer: 'oldAnswer',
                        new: {
                            question: 'newQuestion',
                            answer: 'newAnswer',
                        },
                    };
                    await activateSecretQuestionService.activate(
                        {
                            userId: 'userId',
                            payload,
                        },
                        true
                    );
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Secret question is incorrect');
                    expect(err.name).to.be.equal('Unauthorized');
                    expect(err.code).to.be.equal(HttpStatusCode.UNAUTHORIZED);
                }
            });
        });

        context(
            'When update an user secret question fail: new-structure-secret-question-missing',
            () => {
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
                    try {
                        const payload = {
                            question: 'oldQuestion',
                            answer: 'oldAnswer',
                        };
                        await activateSecretQuestionService.activate(
                            {
                                userId: 'userId',
                                payload,
                            },
                            true
                        );
                    } catch (error) {
                        const err = error as HttpRequestErrors;
                        expect(err.message).to.be.equal(
                            'Structure of new for new question and answer is missing'
                        );
                        expect(err.name).to.be.equal('BadRequest');
                        expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                    }
                });
            }
        );
    });

    context('#save', () => {
        context('When save an user secret question with success', () => {
            beforeEach(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = user.userId;

                usersRepository = {
                    update: sinon.spy(() => user),
                };

                usersDetailsRepository = {
                    update: sinon.spy(() => userDetails),
                };

                activateSecretQuestionService = new ActivateSecretQuestionService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                await activateSecretQuestionService.save({ user, userDetails });

                expect(usersRepository.update).to.have.been.called();
                expect(usersDetailsRepository.update).to.have.been.called();
            });
        });
    });
});

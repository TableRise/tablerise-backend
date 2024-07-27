import sinon from 'sinon';
import UpdateSecretQuestionService from 'src/core/users/services/users/UpdateSecretQuestionService';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';

describe('Core :: Users :: Services :: UpdateSecretQuestionService', () => {
    let updateSecretQuestionService: UpdateSecretQuestionService,
        usersDetailsRepository: any,
        userDetails: UserDetailInstance,
        payload: any,
        httpRequestErrors: HttpRequestErrors;

    const logger = (): void => {};

    context('#update', () => {
        context('When update an user secret question with success', () => {
            beforeEach(() => {
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                usersDetailsRepository = {
                    findOne: () => userDetails,
                };

                payload = {
                    new: {
                        question: 'newQuestion',
                        answer: 'newAnswer',
                    },
                };

                updateSecretQuestionService = new UpdateSecretQuestionService({
                    usersDetailsRepository,
                    httpRequestErrors,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const userDetails = await updateSecretQuestionService.update({
                    userId: '123',
                    payload,
                });

                expect(userDetails.secretQuestion?.question).to.be.equal(
                    payload.new.question
                );
                expect(userDetails.secretQuestion?.answer).to.be.equal(
                    payload.new.answer
                );
            });
        });

        context('When update an user secret question fail ', () => {
            before(() => {
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.secretQuestion = null;

                usersDetailsRepository = {
                    findOne: () => userDetails,
                    update: sinon.spy(() => ({})),
                };

                payload = {
                    new: {
                        question: 'newQuestion',
                        answer: 'newAnswer',
                    },
                };

                updateSecretQuestionService = new UpdateSecretQuestionService({
                    usersDetailsRepository,
                    httpRequestErrors,
                    logger,
                });
            });

            it('should throw an error if secret question is missing - incorrect-secret-question', async () => {
                try {
                    await updateSecretQuestionService.update({
                        userId: '123',
                        payload,
                    });

                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Secret question is incorrect');
                    expect(err.name).to.be.equal(
                        getErrorName(HttpStatusCode.UNAUTHORIZED)
                    );
                    expect(err.code).to.be.equal(HttpStatusCode.UNAUTHORIZED);
                }
            });

            it('should throw an error if new question is wrong - new-structure-secret-question-missing', async () => {
                payload = {};
                try {
                    await updateSecretQuestionService.update({
                        userId: '123',
                        payload,
                    });

                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal(
                        'Structure of new for new question and answer is missing'
                    );
                    expect(err.name).to.be.equal(
                        getErrorName(HttpStatusCode.BAD_REQUEST)
                    );
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                }
            });
        });
    });

    context('#save', () => {
        context('When save an user secret question with success', () => {
            beforeEach(() => {
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                payload = {
                    new: {
                        question: 'newQuestion',
                        answer: 'newAnswer',
                    },
                };
                userDetails.secretQuestion = payload.new;

                usersDetailsRepository = {
                    update: sinon.spy(() => userDetails),
                };

                updateSecretQuestionService = new UpdateSecretQuestionService({
                    usersDetailsRepository,
                    httpRequestErrors,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const { newQuestion } = await updateSecretQuestionService.save(
                    userDetails
                );

                expect(usersDetailsRepository.update).to.have.been.called();
                expect(newQuestion.question).to.be.equal(payload.new.question);
                expect(newQuestion.answer).to.be.equal(payload.new.answer);
            });
        });
    });
});

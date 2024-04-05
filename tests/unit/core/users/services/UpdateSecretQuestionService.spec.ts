import sinon from 'sinon';
import UpdateSecretQuestionService from 'src/core/users/services/users/UpdateSecretQuestionService';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';

import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';

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

            it('should return the correct result', async () => {
                await updateSecretQuestionService.update({ userId: '123', payload });

                expect(usersDetailsRepository.update).to.have.been.called();
            });
        });

        context(
            'When update an user secret question fail - incorrect secrect question',
            () => {
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

                it('should throw an error', async () => {
                    try {
                        await updateSecretQuestionService.update({
                            userId: '123',
                            payload,
                        });

                        expect('it should not be here').to.be.equal(false);
                    } catch (error) {
                        const err = error as HttpRequestErrors;
                        expect(err.message).to.be.equal('Secret question is incorrect');
                        expect(err.name).to.be.equal('Unauthorized');
                        expect(err.code).to.be.equal(HttpStatusCode.UNAUTHORIZED);
                    }
                });
            }
        );
    });
});

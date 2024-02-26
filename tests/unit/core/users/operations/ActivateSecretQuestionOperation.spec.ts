import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import sinon from 'sinon';
import ActivateSecretQuestionOperation from 'src/core/users/operations/users/ActivateSecretQuestionOperation';

describe('Core :: Users :: Operations :: ActivateSecretQuestionOperation', () => {
    let activateSecretQuestionOperation: ActivateSecretQuestionOperation,
        activateSecretQuestionService: any,
        user: any,
        userDetails: any;

    const logger = (): void => {};

    context('When activate a secret question with success', () => {
        before(() => {
            user = DomainDataFaker.generateUsersJSON()[0];

            userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            activateSecretQuestionService = {
                activate: sinon.spy(() => ({
                    user,
                    userDetails,
                })),
                save: sinon.spy(() => {}),
            };

            activateSecretQuestionOperation = new ActivateSecretQuestionOperation({
                activateSecretQuestionService,
                logger,
            });
        });

        it('should call correct methods', async () => {
            const payload = {
                question: '',
                answer: '',
            };
            await activateSecretQuestionOperation.execute({ userId: 'userId', payload }, false);

            expect(activateSecretQuestionService.activate).to.have.been.called();
            expect(activateSecretQuestionService.save).to.have.been.called();
        });
    });
});

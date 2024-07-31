import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import sinon from 'sinon';
import ActivateSecretQuestionOperation from 'src/core/users/operations/users/ActivateSecretQuestionOperation';

describe('Core :: Users :: Operations :: ActivateSecretQuestionOperation', () => {
    let activateSecretQuestionOperation: ActivateSecretQuestionOperation,
        activateSecretQuestionService: any,
        user: any;

    const logger = (): void => {};

    context('When activate a secret question with success', () => {
        before(() => {
            user = DomainDataFaker.generateUsersJSON()[0];

            activateSecretQuestionService = {
                activate: sinon.spy(() => ({
                    user,
                })),
                save: sinon.spy(() => ({
                    active: false,
                })),
            };

            activateSecretQuestionOperation = new ActivateSecretQuestionOperation({
                activateSecretQuestionService,
                logger,
            });
        });

        it('should call correct methods', async () => {
            const payload = { question: '', answer: '' };
            const twofactor = await activateSecretQuestionOperation.execute({
                userId: 'userId',
                payload,
            });

            expect(activateSecretQuestionService.activate).to.have.been.called();
            expect(activateSecretQuestionService.save).to.have.been.called();
            expect(twofactor.active).to.be.equal(false);
        });
    });
});

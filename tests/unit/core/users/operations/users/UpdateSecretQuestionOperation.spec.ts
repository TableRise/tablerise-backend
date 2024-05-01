import sinon from 'sinon';
import UpdateSecretQuestionOperation from 'src/core/users/operations/users/UpdateSecretQuestionOperation';

describe('Core :: Users :: Operations :: UpdateSecretQuestionOperation', () => {
    let updateSecretQuestionOperation: UpdateSecretQuestionOperation,
        updateSecretQuestionService: any,
        payload: any;

    const logger = (): void => {};

    context('When get users with success', () => {
        before(() => {
            updateSecretQuestionService = {
                update: sinon.spy(() => ({})),
            };

            payload = {
                question: 'oldQuestion',
                answer: 'oldAnswer',
                new: {
                    question: 'newQuestion',
                    answer: 'newAnswer',
                },
            };

            updateSecretQuestionOperation = new UpdateSecretQuestionOperation({
                updateSecretQuestionService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            await updateSecretQuestionOperation.execute({ userId: '123', payload });

            expect(updateSecretQuestionService.update).to.have.been.called();
        });
    });
});

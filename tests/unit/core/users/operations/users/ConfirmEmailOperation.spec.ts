import sinon from 'sinon';
import ConfirmEmailOperation from 'src/core/users/operations/users/ConfirmEmailOperation';

describe('Core :: Users :: Operations :: ConfirmEmailOperation', () => {
    let confirmCodeOperation: ConfirmEmailOperation;
    let confirmEmailService: any;

    const logger = (): void => {};

    context('When confirm code with success', () => {
        before(() => {
            confirmEmailService = {
                processCode: sinon.spy(() => ({ status: 'done' })),
            };

            confirmCodeOperation = new ConfirmEmailOperation({
                confirmEmailService,
                logger,
            });
        });

        it('should return the correct status and call correct methods', async () => {
            const email = 'anyEmail';
            const code = 'isValid';
            const expectedStatus = 'done';

            const { status } = await confirmCodeOperation.execute({ email, code });
            expect(status).to.be.equal(expectedStatus);
            expect(confirmEmailService.processCode).to.have.been.called();
        });
    });
});

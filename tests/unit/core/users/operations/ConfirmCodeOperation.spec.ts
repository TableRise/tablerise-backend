import sinon from 'sinon';
import ConfirmCodeOperation from 'src/core/users/operations/users/ConfirmCodeOperation';

describe('Core :: Users :: Operations :: ConfirmCodeOperation', () => {
    let confirmCodeOperation: ConfirmCodeOperation;
    let confirmCodeService: any;

    const logger = (): void => {};

    context('When confirm code with success', () => {
        before(() => {
            confirmCodeService = {
                processCode: sinon.spy(() => ({ status: 'done' })),
            };

            confirmCodeOperation = new ConfirmCodeOperation({
                confirmCodeService,
                logger,
            });
        });

        it('should return the correct status and call correct methods', async () => {
            const userId = 'anyId';
            const code = 'isValid';
            const expectedStatus = 'done';

            const { status } = await confirmCodeOperation.execute({ userId, code });
            expect(status).to.be.equal(expectedStatus);
            expect(confirmCodeService.processCode).to.have.been.called();
        });
    });
});

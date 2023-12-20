import sinon from 'sinon';
import ConfirmCodeOperation from 'src/core/users/operations/users/ConfirmCodeOperation';

describe('Core :: Users :: Operations :: ConfirmCodeOperation', () => {
    let confirmCodeOperation: ConfirmCodeOperation;
    let confirmCodeService: any;

    context('When confirm code with success', () => {
        const loggerMock = sinon.stub();

        before(() => {
            confirmCodeService = {
                processCode: sinon.spy(() => ({ status: 'done' })),
            };

            confirmCodeOperation = new ConfirmCodeOperation({
                confirmCodeService,
                logger: loggerMock,
            });
        });

        it('should return the correct status and call correct methods', async () => {
            const userId = 'anyId';
            const code = 'isValid';
            const expectedStatus = 'done';

            const { status } = await confirmCodeOperation.execute({ userId, code });

            expect(loggerMock).to.be.calledOnce();
            expect(status).to.be.equal(expectedStatus);

            expect(confirmCodeService.processCode).to.have.been.calledOnce();
        });
    });
});

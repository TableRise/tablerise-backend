import sinon from 'sinon';
import ResetProfileOperation from 'src/core/users/operations/users/ResetProfileOperation';
import newUUID from 'src/domains/common/helpers/newUUID';

describe('Core :: Users :: Operations :: Users :: ResetProfileOperation', () => {
    let resetProfileOperation: ResetProfileOperation, resetProfileService: any;

    const logger = (): void => {};

    context('#execute', () => {
        const userId = newUUID();

        before(() => {
            resetProfileService = {
                reset: sinon.spy(),
            };

            resetProfileOperation = new ResetProfileOperation({
                resetProfileService,
                logger,
            });
        });

        it('should call the correct methods', async () => {
            await resetProfileOperation.execute(userId);
            expect(resetProfileService.reset).to.have.been.calledWith(userId);
        });
    });
});

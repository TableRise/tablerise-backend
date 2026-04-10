import sinon from 'sinon';
import UpdateGameInfoOperation from 'src/core/users/operations/users/UpdateGameInfoOperation';
import newUUID from 'src/domains/common/helpers/newUUID';

describe('Core :: Users :: Operations :: Users :: UpdateGameInfoOperation', () => {
    let updateGameInfoOperation: UpdateGameInfoOperation, updateGameInfoService: any, updateGameInfoPayload: any;

    const logger = (): void => {};

    context('#execute', () => {
        context('When game info is updated', () => {
            const userId = newUUID();
            const infoId = newUUID();

            before(() => {
                updateGameInfoService = {
                    update: sinon.spy(),
                };

                updateGameInfoPayload = {
                    userId,
                    infoId,
                    targetInfo: 'badges',
                    operation: 'add',
                };

                updateGameInfoOperation = new UpdateGameInfoOperation({
                    updateGameInfoService,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                await updateGameInfoOperation.execute(updateGameInfoPayload);
                expect(updateGameInfoService.update).to.have.been.calledWith(updateGameInfoPayload);
            });
        });
    });
});

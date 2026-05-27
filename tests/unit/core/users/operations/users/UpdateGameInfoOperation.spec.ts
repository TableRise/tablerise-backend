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
                    add: sinon.spy(),
                    remove: sinon.spy(),
                };

                updateGameInfoPayload = {
                    userId,
                    infoId,
                    targetInfo: 'badges',
                };

                updateGameInfoOperation = new UpdateGameInfoOperation({
                    updateGameInfoService,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                await updateGameInfoOperation.add(updateGameInfoPayload);
                expect(updateGameInfoService.add).to.have.been.calledWith(updateGameInfoPayload);
            });

            it('should call the remove method with the same payload shape', async () => {
                await updateGameInfoOperation.remove(updateGameInfoPayload);
                expect(updateGameInfoService.remove).to.have.been.calledWith(updateGameInfoPayload);
            });
        });
    });
});

import sinon from 'sinon';
import UpdateGameInfoOperation from 'src/core/users/operations/users/UpdateGameInfoOperation';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import newUUID from 'src/domains/common/helpers/newUUID';

describe('Core :: Users :: Operations :: Users :: UpdateGameInfoOperation', () => {
    let updateGameInfoOperation: UpdateGameInfoOperation,
        updateGameInfoService: any,
        updateGameInfoPayload: any;

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
                expect(updateGameInfoService.update).to.have.been.calledWith(
                    updateGameInfoPayload
                );
            });
        });

        context('When game info is updated - infoId is invalid', () => {
            const userId = newUUID();
            const infoId = '123';

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
                try {
                    await updateGameInfoOperation.execute(updateGameInfoPayload);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('The parameter infoId is invalid');
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                    expect(err.name).to.be.equal(
                        getErrorName(HttpStatusCode.BAD_REQUEST)
                    );
                }
            });
        });
    });
});

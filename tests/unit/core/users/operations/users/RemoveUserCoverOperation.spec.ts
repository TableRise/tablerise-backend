import sinon from 'sinon';
import RemoveUserCoverOperation from 'src/core/users/operations/users/RemoveUserCoverOperation';

describe('Core :: Users :: Operation :: Users :: RemoveUserCoverOperation', () => {
    it('should delegate the cover removal to the service', async () => {
        const removeUserCoverService = {
            remove: sinon.stub().resolves(),
        };
        const logger = (): void => {};
        const operation = new RemoveUserCoverOperation({
            removeUserCoverService,
            logger,
        } as any);
        const payload = {
            userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
        };

        await operation.execute(payload);

        expect(removeUserCoverService.remove).to.have.been.calledWith(payload);
    });
});

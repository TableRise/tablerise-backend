import sinon from 'sinon';
import { FileObject } from 'src/types/shared/file';
import UpdateUserCoverOperation from 'src/core/users/operations/users/UpdateUserCoverOperation';

describe('Core :: Users :: Operation :: Users :: UpdateUserCoverOperation', () => {
    it('should delegate the cover update to the service', async () => {
        const updateUserCoverService = {
            update: sinon.stub().resolves(),
        };
        const logger = (): void => {};
        const operation = new UpdateUserCoverOperation({
            updateUserCoverService,
            logger,
        } as any);
        const payload = {
            userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
            image: { originalname: 'cover.png' } as FileObject,
        };

        await operation.execute(payload);

        expect(updateUserCoverService.update).to.have.been.calledWith(payload);
    });
});

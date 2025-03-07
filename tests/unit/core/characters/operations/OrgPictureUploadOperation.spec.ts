import OrgPictureUploadOperation from 'src/core/characters/operations/OrgPictureUploadOperation';
import Sinon from 'sinon';
import { FileObject } from 'src/types/shared/file';

describe('Core :: Characters :: Operations :: OrgPictureUploadOperation', () => {
    let orgPictureUploadOperation: OrgPictureUploadOperation,
        orgPictureUploadService: any,
        payload: any;

    const logger = (): void => {};

    context('When a picture is uploaded to organization', () => {
        beforeEach(() => {
            payload = {
                orgName: 'string',
                characterId: 'string',
                image: {} as FileObject,
            };

            orgPictureUploadService = { uploadPicture: Sinon.spy(() => {}) };

            orgPictureUploadOperation = new OrgPictureUploadOperation({
                logger,
                orgPictureUploadService,
            });
        });

        it('should update the organization picture', async () => {
            await orgPictureUploadOperation.execute(payload);

            expect(orgPictureUploadService.uploadPicture).to.have.been.calledWith(
                payload
            );
        });
    });
});

import UpdateCharacterPictureOperation from 'src/core/characters/operations/UpdateCharacterPictureOperation';
import Sinon from 'sinon';
import { FileObject } from 'src/types/shared/file';

describe('Core :: Characters :: Operations :: UpdateCharacterPictureOperation', () => {
    let updateCharacterPictureOperation: UpdateCharacterPictureOperation,
        updateCharacterPictureService: any,
        payload: any;

    const logger = (): void => {};

    context('When a picture is uploaded to a character', () => {
        beforeEach(() => {
            payload = {
                characterId: 'string',
                image: {} as FileObject,
            };

            updateCharacterPictureService = { uploadPicture: Sinon.spy(() => {}) };

            updateCharacterPictureOperation = new UpdateCharacterPictureOperation({
                logger,
                updateCharacterPictureService,
            });
        });

        it('should update the organization picture', async () => {
            await updateCharacterPictureOperation.execute(payload);

            expect(updateCharacterPictureService.uploadPicture).to.have.been.calledWith(payload);
        });
    });
});

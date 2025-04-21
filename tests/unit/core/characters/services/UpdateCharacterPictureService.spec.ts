import UpdateCharacterPictureService from 'src/core/characters/services/UpdateCharacterPictureService';
import Sinon from 'sinon';
import { FileObject } from 'src/types/shared/file';
import { UpdateCharacterPicturePayload } from 'src/types/api/characters/http/payload';

describe('Core :: Characters :: Services :: UpdateCharacterPictureService', () => {
    let updateCharacterPictureService: UpdateCharacterPictureService,
        charactersRepository: any,
        imageStorageClient: any,
        payload: UpdateCharacterPicturePayload;

    const logger = (): void => {};

    context('When a picture is uploaded to a character', () => {
        beforeEach(() => {
            payload = {
                characterId: 'string',
                image: {} as FileObject,
            };

            charactersRepository = {
                findOne: Sinon.spy(async () => ({
                    picture: '',
                    characterId: 'string',
                })),
                update: Sinon.spy(async () => ({})),
            };

            imageStorageClient = { upload: Sinon.spy(async () => 'image-url') };

            updateCharacterPictureService = new UpdateCharacterPictureService({
                logger,
                charactersRepository,
                imageStorageClient,
            });
        });

        it('should update the character picture', async () => {
            await updateCharacterPictureService.uploadPicture(payload);

            expect(charactersRepository.findOne).to.have.been.calledWith({
                characterId: payload.characterId,
            });
            expect(imageStorageClient.upload).to.have.been.calledWith(payload.image);
            expect(charactersRepository.update).to.have.been.calledWith({
                query: { characterId: 'string' },
                payload: Sinon.match.object,
            });
        });

        it('should throw an error if character is not found', async () => {
            charactersRepository.findOne = Sinon.spy(async () => {
                throw new Error('Character not found');
            });

            try {
                await updateCharacterPictureService.uploadPicture(payload);
            } catch (error: unknown) {
                expect((error as Error).message).to.equal('Character not found');
            }
        });

        it('should throw an error if image upload fails', async () => {
            imageStorageClient.upload = Sinon.spy(async () => {
                throw new Error('Image upload failed');
            });

            try {
                await updateCharacterPictureService.uploadPicture(payload);
            } catch (error: unknown) {
                expect((error as Error).message).to.equal('Image upload failed');
            }
        });

        it('should throw an error if repository update fails', async () => {
            charactersRepository.update = Sinon.spy(async () => {
                throw new Error('Update failed');
            });

            try {
                await updateCharacterPictureService.uploadPicture(payload);
            } catch (error: unknown) {
                expect((error as Error).message).to.equal('Update failed');
            }
        });
    });
});

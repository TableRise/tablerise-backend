import UpdateCharacterPictureService from 'src/core/characters/services/UpdateCharacterPictureService';
import Sinon from 'sinon';
import { FileObject } from 'src/types/shared/file';
import { UpdateCharacterPicturePayload } from 'src/types/api/characters/http/payload';

describe('Core :: Characters :: Services :: UpdateCharacterPictureService', () => {
    let updateCharacterPictureService: UpdateCharacterPictureService,
        charactersRepository: any,
        imageStorageClient: any,
        character: any,
        payload: UpdateCharacterPicturePayload;

    const logger = (): void => {};

    context('When updating character picture', () => {
        beforeEach(() => {
            character = {
                characterId: '1',
                author: {
                    userId: '123',
                },
                picture: 'old-picture.jpg',
            };

            payload = {
                characterId: character.characterId,
                image: {} as FileObject,
            };

            charactersRepository = {
                findOne: Sinon.spy(async () => character),
                update: Sinon.spy(async (params) => ({
                    ...character,
                    picture: params.payload.picture,
                })),
            };

            imageStorageClient = {
                upload: Sinon.spy(async () => 'new-picture.jpg'),
            };

            updateCharacterPictureService = new UpdateCharacterPictureService({
                charactersRepository,
                imageStorageClient,
                logger,
            });
        });

        it('should upload image and update character picture successfully', async () => {
            const response = await updateCharacterPictureService.updateCharacterPicture(
                payload
            );

            expect(charactersRepository.findOne).to.be.calledWith({
                characterId: character.characterId,
            });
            expect(imageStorageClient.upload).to.be.calledWith(payload.image);
            expect(charactersRepository.update).to.be.calledWith({
                query: { characterId: character.characterId },
                payload: Sinon.match.object,
            });
            expect(response).to.deep.equal({
                ...character,
                picture: 'new-picture.jpg',
            });
        });
    });
});

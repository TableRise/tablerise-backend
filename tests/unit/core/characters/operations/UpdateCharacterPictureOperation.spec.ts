import UpdateCharacterPictureOperation from "src/core/characters/operations/UpdateCharacterPictureOperation";
import Sinon from "sinon";
import { FileObject } from 'src/types/shared/file';

describe("Core :: Characters :: Operations :: UpdateCharacterPictureOperation", () => {
    let updateCharacterPictureOperation: UpdateCharacterPictureOperation,
        updateCharacterPictureService: any,
        character: any;

    const logger = (): void => {};

    context("#updateCharacterPicture", () => {
        beforeEach(() => {
            character = {
                characterId: "1",
                author: {
                    userId: "123"
                },
                picture: "old-picture.jpg"
            };

            updateCharacterPictureService = {
                updateCharacterPicture: Sinon.spy(() => ({
                    characterId: character.characterId,
                    picture: "new-picture.jpg"
                }))
            };

            updateCharacterPictureOperation = new UpdateCharacterPictureOperation({
                updateCharacterPictureService,
                logger
            });
        });

        it("should update character picture successfully", async () => {
            const payload = {
                characterId: character.characterId,
                userId: character.author.userId,
                image: {} as FileObject
            };

            const response = await updateCharacterPictureOperation.execute(payload);

            expect(updateCharacterPictureService.updateCharacterPicture).to.have.been.calledWith(payload);
            expect(response).to.deep.equal({
                characterId: character.characterId,
                picture: "new-picture.jpg"
            });
        });
    });
});

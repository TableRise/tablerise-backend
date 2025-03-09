import sinon from 'sinon';
import GetCharacterByIdService from 'src/core/characters/services/GetCharacterByIdService';
import newUUID from 'src/domains/common/helpers/newUUID';

describe('Core :: Characters :: Services :: GetCharacterByIdService', () => {
    let getCharacterByIdService: GetCharacterByIdService, charactersRepository: any;

    const logger = (): void => {};

    context('#get', () => {
        context('When a character is recovered by id', () => {
            const characterId = newUUID();

            before(() => {
                charactersRepository = {
                    findOne: sinon.spy(),
                };

                getCharacterByIdService = new GetCharacterByIdService({
                    charactersRepository,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                await getCharacterByIdService.get(characterId);
                expect(charactersRepository.findOne).to.have.been.called();
            });
        });
    });
});

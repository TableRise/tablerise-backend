import sinon from 'sinon';
import GetAllCharactersService from 'src/core/characters/services/GetAllCharactersService';
import DomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';
import newUUID from 'src/domains/common/helpers/newUUID';

describe('Core :: Characters :: Services :: GetAllCharactersService', () => {
    let getAllCharactersService: GetAllCharactersService,
        charactersRepository: any,
        characters: any;

    const logger = (): void => {};

    context('#get', () => {
        context('When all characters are successfully recovered', () => {
            before(() => {
                const id = newUUID();

                characters = DomainDataFaker.generateCharactersJSON({
                    count: 3,
                    characterId: id,
                });

                charactersRepository = {
                    find: sinon.spy(() => characters),
                };

                getAllCharactersService = new GetAllCharactersService({
                    charactersRepository,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                const charactersTest = await getAllCharactersService.getAll();
                expect(charactersRepository.find).to.have.been.called();
                expect(charactersTest).to.be.deep.equal(characters);
            });
        });
    });
});

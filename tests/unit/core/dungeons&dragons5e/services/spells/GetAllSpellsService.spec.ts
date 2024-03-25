import sinon from 'sinon';
import GetAllSpellsService from 'src/core/dungeons&dragons5e/services/spells/GetAllSpellsService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Services :: GetAllSpellsService', () => {
    let getAllSpellsService: GetAllSpellsService,
        dungeonsAndDragonsRepository: any,
        spells: any;

    const logger = (): void => {};

    context('When spells are recovered with success', () => {
        before(() => {
            spells = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'spells',
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => spells),
                setEntity: sinon.spy(() => {}),
            };

            getAllSpellsService = new GetAllSpellsService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const spellsTest = await getAllSpellsService.getAll();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Spells'
            );
            expect(spellsTest).to.be.deep.equal(spells);
        });
    });
});

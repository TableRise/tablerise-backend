import sinon from 'sinon';
import GetDisabledSpellsService from 'src/core/dungeons&dragons5e/services/spells/GetDisabledSpellsService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: GetDisabledSpellsService', () => {
    let getDisabledSpellsService: GetDisabledSpellsService,
        dungeonsAndDragonsRepository: any,
        spells: any;

    const logger = (): void => {};

    context('When disabled spells are recovered with success', () => {
        before(() => {
            spells = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'spells',
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => spells),
                setEntity: sinon.spy(() => {}),
            };

            getDisabledSpellsService = new GetDisabledSpellsService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const spellsTest = await getDisabledSpellsService.getAllDisabled();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Spells'
            );
            expect(spellsTest).to.be.deep.equal(spells);
        });
    });
});

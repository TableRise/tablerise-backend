import sinon from 'sinon';
import GetSpellService from 'src/core/dungeons&dragons5e/services/spells/GetSpellService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: GetSpellService', () => {
    let getSpellService: GetSpellService, dungeonsAndDragonsRepository: any, spell: any;

    const logger = (): void => {};

    context('When spell is recovered with success', () => {
        before(() => {
            spell = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'spells',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => spell[0]),
                setEntity: sinon.spy(() => {}),
            };

            getSpellService = new GetSpellService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const spellsTest = await getSpellService.get('123');

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Spells'
            );
            expect(spellsTest).to.be.deep.equal(spell[0]);
        });
    });
});

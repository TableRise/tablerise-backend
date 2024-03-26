import sinon from 'sinon';
import ToggleSpellsAvailabilityService from 'src/core/dungeons&dragons5e/services/spells/ToggleSpellsAvailabilityService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: ToggleSpellsAvailabilityService', () => {
    let toggleSpellsAvailabilityService: ToggleSpellsAvailabilityService,
        dungeonsAndDragonsRepository: any,
        spell: any;

    const logger = (): void => {};

    context('When spell availability is toggled with success', () => {
        before(() => {
            spell = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'spells',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => spell[0]),
                update: sinon.spy(() => spell[0]),
                setEntity: sinon.spy(() => {}),
            };

            toggleSpellsAvailabilityService = new ToggleSpellsAvailabilityService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const spellsTest = await toggleSpellsAvailabilityService.toggle({
                id: '123',
                availability: false,
            });

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Spells'
            );
            expect(spellsTest).to.be.deep.equal({ ...spell[0], active: false });
        });
    });
});

import sinon from 'sinon';
import ToggleSpellOperation from 'src/core/dungeons&dragons5e/operations/spells/ToggleSpellsAvailabilityOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: ToggleSpellOperation', () => {
    let toggleSpellOperation: ToggleSpellOperation,
        toggleSpellsAvailabilityService: any,
        spell: any;

    const logger = (): void => {};

    context('When spell availability is toggled with success', () => {
        before(() => {
            spell = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'spells',
            });

            toggleSpellsAvailabilityService = {
                toggle: sinon.spy(() => spell[0]),
            };

            toggleSpellOperation = new ToggleSpellOperation({
                toggleSpellsAvailabilityService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const spellTest = await toggleSpellOperation.execute({
                id: '123',
                availability: false,
            });

            expect(toggleSpellsAvailabilityService.toggle).to.have.been.called();
            expect(spellTest).to.be.deep.equal(spell[0]);
        });
    });
});

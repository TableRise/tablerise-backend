import sinon from 'sinon';
import ToggleArmorOperation from 'src/core/dungeons&dragons5e/operations/armors/ToggleArmorsAvailabilityOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: ToggleArmorOperation', () => {
    let toggleArmorOperation: ToggleArmorOperation,
        toggleArmorsAvailabilityService: any,
        armor: any;

    const logger = (): void => {};

    context('When armor availability is toggled with success', () => {
        before(() => {
            armor = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'armors',
            });

            toggleArmorsAvailabilityService = {
                toggle: sinon.spy(() => armor[0]),
            };

            toggleArmorOperation = new ToggleArmorOperation({
                toggleArmorsAvailabilityService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const armorTest = await toggleArmorOperation.execute({
                id: '123',
                availability: false,
            });

            expect(toggleArmorsAvailabilityService.toggle).to.have.been.called();
            expect(armorTest).to.be.deep.equal(armor[0]);
        });
    });
});

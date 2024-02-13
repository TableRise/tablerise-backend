import sinon from 'sinon';
import ToggleArmorsAvailabilityOperation from 'src/core/dungeons&dragons5e/operations/armors/ToggleArmorsAvailabilityOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe.only('Core :: Dungeons&Dragons5e :: Operations :: Armors :: ToggleArmorsAvailabilityOperation', () => {
    let toggleArmorsAvailabilityOperation: ToggleArmorsAvailabilityOperation,
        toggleArmorsAvailabilityService: any,
        armors: any;

    const logger = (): void => {};

    context('When the active of the armors is successfully changed', () => {
        armors = DomainDataFaker.generateDungeonsAndDragonsJSON({
            count: 1,
            entity: 'armors',
        });

        const armorsMock = armors.map((armor: any) => ({
            ...armor,
            active: true,
        }));

        toggleArmorsAvailabilityService = {
            toggle: sinon.spy(() => armorsMock),
        };

        toggleArmorsAvailabilityOperation = new ToggleArmorsAvailabilityOperation({
            toggleArmorsAvailabilityService,
            logger,
        });

        it('should change the armors active correctly', async () => {
            const updatedArmors = await toggleArmorsAvailabilityOperation.execute(armors);

            expect(toggleArmorsAvailabilityService.toggle).to.have.been.called();
            expect(updatedArmors).to.be.deep.equal(armorsMock);
        });
    });
});

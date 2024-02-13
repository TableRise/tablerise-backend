import Sinon from 'sinon';
import ToggleArmorsAvailabilityService from 'src/core/dungeons&dragons5e/services/armors/ToggleArmorsAvailabilityService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Services :: Armors :: ToggleArmorsAvailabilityService', () => {
    let toggleArmorsAvailabilityService: ToggleArmorsAvailabilityService,
        dungeonsAndDragonsRepository: any,
        armors: any;

    const logger = (): void => {};

    context('When the active of the armors is successfully changed', () => {
        armors = DomainDataFaker.generateDungeonsAndDragonsJSON({
            count: 1,
            entity: 'armors',
        });

        const armorsMock = armors.map((armor: any) => ({
            ...armor,
            active: false,
        }));

        dungeonsAndDragonsRepository = {
            setEntity: Sinon.spy(() => {}),
            findOne: Sinon.spy(() => armors),
            update: Sinon.spy(() => armorsMock),
        };

        toggleArmorsAvailabilityService = new ToggleArmorsAvailabilityService({
            dungeonsAndDragonsRepository,
            logger,
        });

        it('should change the armor active correctly', async () => {
            const armor = await toggleArmorsAvailabilityService.toggle(armors);

            expect(toggleArmorsAvailabilityService.toggle).to.have.been.called();
            expect(armor).to.be.deep.equal(armorsMock);
        });
    });
});

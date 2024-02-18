import sinon from 'sinon';
import ToggleArmorsAvailabilityService from 'src/core/dungeons&dragons5e/services/armors/ToggleArmorsAvailabilityService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: ToggleArmorsAvailabilityService', () => {
    let toggleArmorsAvailabilityService: ToggleArmorsAvailabilityService,
        dungeonsAndDragonsRepository: any,
        armor: any;

    const logger = (): void => {};

    context('When armor availability is toggled with success', () => {
        before(() => {
            armor = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'armors',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => armor[0]),
                update: sinon.spy(() => armor[0]),
                setEntity: sinon.spy(() => {}),
            };

            toggleArmorsAvailabilityService =
                new ToggleArmorsAvailabilityService({
                    dungeonsAndDragonsRepository,
                    logger,
                });
        });

        it('should return the correct data and call correct methods', async () => {
            const armorsTest = await toggleArmorsAvailabilityService.toggle({
                id: '123',
                availability: false,
            });

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Armors'
            );
            expect(armorsTest).to.be.deep.equal({ ...armor[0], active: false });
        });
    });
});
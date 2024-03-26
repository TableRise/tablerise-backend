import sinon from 'sinon';
import ToggleWeaponsAvailabilityService from 'src/core/dungeons&dragons5e/services/weapons/ToggleWeaponsAvailabilityService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: ToggleWeaponsAvailabilityService', () => {
    let toggleWeaponsAvailabilityService: ToggleWeaponsAvailabilityService,
        dungeonsAndDragonsRepository: any,
        weapon: any;

    const logger = (): void => {};

    context('When weapon availability is toggled with success', () => {
        before(() => {
            weapon = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'weapons',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => weapon[0]),
                update: sinon.spy(() => weapon[0]),
                setEntity: sinon.spy(() => {}),
            };

            toggleWeaponsAvailabilityService = new ToggleWeaponsAvailabilityService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const weaponsTest = await toggleWeaponsAvailabilityService.toggle({
                id: '123',
                availability: false,
            });

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Weapons'
            );
            expect(weaponsTest).to.be.deep.equal({ ...weapon[0], active: false });
        });
    });
});

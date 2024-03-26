import sinon from 'sinon';
import ToggleWeaponOperation from 'src/core/dungeons&dragons5e/operations/weapons/ToggleWeaponsAvailabilityOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: ToggleWeaponOperation', () => {
    let toggleWeaponOperation: ToggleWeaponOperation,
        toggleWeaponsAvailabilityService: any,
        weapon: any;

    const logger = (): void => {};

    context('When weapon availability is toggled with success', () => {
        before(() => {
            weapon = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'weapons',
            });

            toggleWeaponsAvailabilityService = {
                toggle: sinon.spy(() => weapon[0]),
            };

            toggleWeaponOperation = new ToggleWeaponOperation({
                toggleWeaponsAvailabilityService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const weaponTest = await toggleWeaponOperation.execute({
                id: '123',
                availability: false,
            });

            expect(toggleWeaponsAvailabilityService.toggle).to.have.been.called();
            expect(weaponTest).to.be.deep.equal(weapon[0]);
        });
    });
});

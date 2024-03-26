import sinon from 'sinon';
import GetWeaponService from 'src/core/dungeons&dragons5e/services/weapons/GetWeaponService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: GetWeaponService', () => {
    let getWeaponService: GetWeaponService,
        dungeonsAndDragonsRepository: any,
        weapon: any;

    const logger = (): void => {};

    context('When weapon is recovered with success', () => {
        before(() => {
            weapon = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'weapons',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => weapon[0]),
                setEntity: sinon.spy(() => {}),
            };

            getWeaponService = new GetWeaponService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const weaponsTest = await getWeaponService.get('123');

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Weapons'
            );
            expect(weaponsTest).to.be.deep.equal(weapon[0]);
        });
    });
});

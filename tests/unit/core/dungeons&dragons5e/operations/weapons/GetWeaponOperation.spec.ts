import sinon from 'sinon';
import GetWeaponOperation from 'src/core/dungeons&dragons5e/operations/weapons/GetWeaponOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: GetWeaponOperation', () => {
    let getWeaponOperation: GetWeaponOperation, getWeaponService: any, weapon: any;

    const logger = (): void => {};

    context('When weapon is recovered with success', () => {
        before(() => {
            weapon = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'weapons',
            });

            getWeaponService = {
                get: sinon.spy(() => weapon[0]),
            };

            getWeaponOperation = new GetWeaponOperation({
                getWeaponService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const weaponTest = await getWeaponOperation.execute('123');

            expect(getWeaponService.get).to.have.been.called();
            expect(weaponTest).to.be.deep.equal(weapon[0]);
        });
    });
});

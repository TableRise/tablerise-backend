import sinon from 'sinon';
import GetDisabledWeaponsService from 'src/core/dungeons&dragons5e/services/weapons/GetDisabledWeaponsService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: GetDisabledWeaponsService', () => {
    let getDisabledWeaponsService: GetDisabledWeaponsService,
        dungeonsAndDragonsRepository: any,
        weapons: any;

    const logger = (): void => {};

    context('When disabled weapons are recovered with success', () => {
        before(() => {
            weapons = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'weapons',
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => weapons),
                setEntity: sinon.spy(() => {}),
            };

            getDisabledWeaponsService = new GetDisabledWeaponsService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const weaponsTest = await getDisabledWeaponsService.getAllDisabled();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Weapons'
            );
            expect(weaponsTest).to.be.deep.equal(weapons);
        });
    });
});

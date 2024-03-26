import sinon from 'sinon';
import GetAllWeaponsService from 'src/core/dungeons&dragons5e/services/weapons/GetAllWeaponsService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Services :: GetAllWeaponsService', () => {
    let getAllWeaponsService: GetAllWeaponsService,
        dungeonsAndDragonsRepository: any,
        weapons: any;

    const logger = (): void => {};

    context('When weapons are recovered with success', () => {
        before(() => {
            weapons = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'weapons',
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => weapons),
                setEntity: sinon.spy(() => {}),
            };

            getAllWeaponsService = new GetAllWeaponsService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const weaponsTest = await getAllWeaponsService.getAll();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Weapons'
            );
            expect(weaponsTest).to.be.deep.equal(weapons);
        });
    });
});

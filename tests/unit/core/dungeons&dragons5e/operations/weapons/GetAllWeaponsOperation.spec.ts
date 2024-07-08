import sinon from 'sinon';
import GetAllWeaponsOperation from 'src/core/dungeons&dragons5e/operations/weapons/GetAllWeaponsOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Operations :: GetAllWeaponsOperation', () => {
    let getAllWeaponsOperation: GetAllWeaponsOperation,
        getAllWeaponsService: any,
        weapons: any;

    const logger = (): void => {};

    context('When weapons are recovered with success', () => {
        before(() => {
            weapons = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'weapons',
            });

            getAllWeaponsService = {
                getAll: sinon.spy(() => weapons),
            };

            getAllWeaponsOperation = new GetAllWeaponsOperation({
                getAllWeaponsService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const weaponsTest = await getAllWeaponsOperation.execute();

            expect(getAllWeaponsService.getAll).to.have.been.called();
            expect(weaponsTest).to.be.deep.equal(weapons);
        });
    });
});

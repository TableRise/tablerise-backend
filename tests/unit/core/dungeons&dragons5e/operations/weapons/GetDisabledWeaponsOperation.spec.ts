import sinon from 'sinon';
import GetDisabledWeaponsOperation from 'src/core/dungeons&dragons5e/operations/weapons/GetDisabledWeaponsOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: GetDisabledWeaponsOperation', () => {
    let getDisabledWeaponsOperation: GetDisabledWeaponsOperation,
        getDisabledWeaponsService: any,
        weapons: any;

    const logger = (): void => {};

    context('When disabled weapons are recovered with success', () => {
        before(() => {
            weapons = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'weapons',
            });

            getDisabledWeaponsService = {
                getAllDisabled: sinon.spy(() => weapons),
            };

            getDisabledWeaponsOperation = new GetDisabledWeaponsOperation({
                getDisabledWeaponsService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const weaponsTest = await getDisabledWeaponsOperation.execute();

            expect(getDisabledWeaponsService.getAllDisabled).to.have.been.called();
            expect(weaponsTest).to.be.deep.equal(weapons);
        });
    });
});

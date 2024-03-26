import sinon from 'sinon';
import GetDisabledMagicItemsOperation from 'src/core/dungeons&dragons5e/operations/magicItems/GetDisabledMagicItemsOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: GetDisabledMagicItemsOperation', () => {
    let getDisabledMagicItemsOperation: GetDisabledMagicItemsOperation,
        getDisabledMagicItemsService: any,
        magicItems: any;

    const logger = (): void => {};

    context('When disabled magicItems are recovered with success', () => {
        before(() => {
            magicItems = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'magicItems',
            });

            getDisabledMagicItemsService = {
                getAllDisabled: sinon.spy(() => magicItems),
            };

            getDisabledMagicItemsOperation = new GetDisabledMagicItemsOperation({
                getDisabledMagicItemsService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const magicItemsTest = await getDisabledMagicItemsOperation.execute();

            expect(getDisabledMagicItemsService.getAllDisabled).to.have.been.called();
            expect(magicItemsTest).to.be.deep.equal(magicItems);
        });
    });
});

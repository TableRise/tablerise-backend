import sinon from 'sinon';
import GetDisabledItemsOperation from 'src/core/dungeons&dragons5e/operations/items/GetDisabledItemsOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: GetDisabledItemsOperation', () => {
    let getDisabledItemsOperation: GetDisabledItemsOperation,
        getDisabledItemsService: any,
        items: any;

    const logger = (): void => {};

    context('When disabled items are recovered with success', () => {
        before(() => {
            items = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'items',
            });

            getDisabledItemsService = {
                getAllDisabled: sinon.spy(() => items),
            };

            getDisabledItemsOperation = new GetDisabledItemsOperation({
                getDisabledItemsService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const itemsTest = await getDisabledItemsOperation.execute();

            expect(getDisabledItemsService.getAllDisabled).to.have.been.called();
            expect(itemsTest).to.be.deep.equal(items);
        });
    });
});

import sinon from 'sinon';
import GetAllItemsOperation from 'src/core/dungeons&dragons5e/operations/items/GetAllItemsOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Operations :: GetAllItemsOperation', () => {
    let getAllItemsOperation: GetAllItemsOperation, getAllItemsService: any, Items: any;

    const logger = (): void => {};

    context('When Items are recovered with success', () => {
        before(() => {
            Items = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'items',
            });

            getAllItemsService = {
                getAll: sinon.spy(() => Items),
            };

            getAllItemsOperation = new GetAllItemsOperation({
                getAllItemsService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const ItemsTest = await getAllItemsOperation.execute();

            expect(getAllItemsService.getAll).to.have.been.called();
            expect(ItemsTest).to.be.deep.equal(Items);
        });
    });
});

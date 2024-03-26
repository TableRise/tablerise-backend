import sinon from 'sinon';
import GetItemOperation from 'src/core/dungeons&dragons5e/operations/items/GetItemOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: GetItemOperation', () => {
    let getItemOperation: GetItemOperation, getItemService: any, item: any;

    const logger = (): void => {};

    context('When item is recovered with success', () => {
        before(() => {
            item = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'items',
            });

            getItemService = {
                get: sinon.spy(() => item[0]),
            };

            getItemOperation = new GetItemOperation({
                getItemService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const itemTest = await getItemOperation.execute('123');

            expect(getItemService.get).to.have.been.called();
            expect(itemTest).to.be.deep.equal(item[0]);
        });
    });
});

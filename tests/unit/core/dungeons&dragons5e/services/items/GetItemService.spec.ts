import sinon from 'sinon';
import GetItemService from 'src/core/dungeons&dragons5e/services/items/GetItemService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: GetItemService', () => {
    let getItemService: GetItemService, dungeonsAndDragonsRepository: any, item: any;

    const logger = (): void => {};

    context('When item is recovered with success', () => {
        before(() => {
            item = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'items',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => item[0]),
                setEntity: sinon.spy(() => {}),
            };

            getItemService = new GetItemService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const itemsTest = await getItemService.get('123');

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Items'
            );
            expect(itemsTest).to.be.deep.equal(item[0]);
        });
    });
});

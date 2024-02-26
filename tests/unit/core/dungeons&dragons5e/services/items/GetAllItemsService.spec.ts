import sinon from 'sinon';
import GetAllItemsService from 'src/core/dungeons&dragons5e/services/items/GetAllItemsService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Services :: GetAllItemsService', () => {
    let getAllItemsService: GetAllItemsService,
        dungeonsAndDragonsRepository: any,
        Items: any;

    const logger = (): void => {};

    context('When Items are recovered with success', () => {
        before(() => {
            Items = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'items',
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => Items),
                setEntity: sinon.spy(() => {}),
            };

            getAllItemsService = new GetAllItemsService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const ItemsTest = await getAllItemsService.getAll();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Items'
            );
            expect(ItemsTest).to.be.deep.equal(Items);
        });
    });
});

import sinon from 'sinon';
import GetDisabledItemsService from 'src/core/dungeons&dragons5e/services/items/GetDisabledItemsService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: GetDisabledItemsService', () => {
    let getDisabledItemsService: GetDisabledItemsService,
        dungeonsAndDragonsRepository: any,
        items: any;

    const logger = (): void => {};

    context('When disabled items are recovered with success', () => {
        before(() => {
            items = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'items',
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => items),
                setEntity: sinon.spy(() => {}),
            };

            getDisabledItemsService = new GetDisabledItemsService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const itemsTest = await getDisabledItemsService.getAllDisabled();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Items'
            );
            expect(itemsTest).to.be.deep.equal(items);
        });
    });
});

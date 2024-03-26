import sinon from 'sinon';
import ToggleItemsAvailabilityService from 'src/core/dungeons&dragons5e/services/items/ToggleItemsAvailabilityService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: ToggleItemsAvailabilityService', () => {
    let toggleItemsAvailabilityService: ToggleItemsAvailabilityService,
        dungeonsAndDragonsRepository: any,
        item: any;

    const logger = (): void => {};

    context('When item availability is toggled with success', () => {
        before(() => {
            item = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'items',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => item[0]),
                update: sinon.spy(() => item[0]),
                setEntity: sinon.spy(() => {}),
            };

            toggleItemsAvailabilityService = new ToggleItemsAvailabilityService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const itemsTest = await toggleItemsAvailabilityService.toggle({
                id: '123',
                availability: false,
            });

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Items'
            );
            expect(itemsTest).to.be.deep.equal({ ...item[0], active: false });
        });
    });
});

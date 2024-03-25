import sinon from 'sinon';
import ToggleItemOperation from 'src/core/dungeons&dragons5e/operations/items/ToggleItemsAvailabilityOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: ToggleItemOperation', () => {
    let toggleItemOperation: ToggleItemOperation,
        toggleItemsAvailabilityService: any,
        item: any;

    const logger = (): void => {};

    context('When item availability is toggled with success', () => {
        before(() => {
            item = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'items',
            });

            toggleItemsAvailabilityService = {
                toggle: sinon.spy(() => item[0]),
            };

            toggleItemOperation = new ToggleItemOperation({
                toggleItemsAvailabilityService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const itemTest = await toggleItemOperation.execute({
                id: '123',
                availability: false,
            });

            expect(toggleItemsAvailabilityService.toggle).to.have.been.called();
            expect(itemTest).to.be.deep.equal(item[0]);
        });
    });
});

import sinon from 'sinon';
import ToggleMagicItemsOperation from 'src/core/dungeons&dragons5e/operations/magicItems/ToggleMagicItemsAvailabilityOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe.only('Core :: Dungeons&dragons5e :: Operations :: ToggleMagicItemsOperation', () => {
    let toggleMagicItemsOperation: ToggleMagicItemsOperation,
        toggleMagicItemsAvailabilityService: any,
        _magicItems: any;

    const logger = (): void => {};

    context('When MagicItemses are recovered with success', () => {
        before(() => {
            _magicItems = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'magicItems',
            });

            toggleMagicItemsAvailabilityService = {
                toggle: sinon.spy(() => _magicItems[0]),
            };

            toggleMagicItemsOperation = new ToggleMagicItemsOperation({
                toggleMagicItemsAvailabilityService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const MagicItemsTest = await toggleMagicItemsOperation.execute({
                id: '123',
                availability: false,
            });

            expect(toggleMagicItemsAvailabilityService.toggle).to.have.been.called();
            expect(MagicItemsTest).to.be.deep.equal(_magicItems[0]);
        });
    });
});

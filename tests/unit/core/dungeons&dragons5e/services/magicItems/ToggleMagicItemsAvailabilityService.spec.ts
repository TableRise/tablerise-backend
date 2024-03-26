import sinon from 'sinon';
import ToggleMagicItemsAvailabilityService from 'src/core/dungeons&dragons5e/services/magicItems/ToggleMagicItemsAvailabilityService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: ToggleMagicItemsAvailabilityService', () => {
    let toggleMagicItemsAvailabilityService: ToggleMagicItemsAvailabilityService,
        dungeonsAndDragonsRepository: any,
        _magicItems: any;

    const logger = (): void => {};

    context('When MagicItems are recovered with success', () => {
        before(() => {
            _magicItems = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'magicItems',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => _magicItems[0]),
                update: sinon.spy(() => _magicItems[0]),
                setEntity: sinon.spy(() => {}),
            };

            toggleMagicItemsAvailabilityService = new ToggleMagicItemsAvailabilityService(
                {
                    dungeonsAndDragonsRepository,
                    logger,
                }
            );
        });

        it('should return the correct data and call correct methods', async () => {
            const MagicItemsTest = await toggleMagicItemsAvailabilityService.toggle({
                id: '123',
                availability: false,
            });

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'MagicItems'
            );
            expect(MagicItemsTest).to.be.deep.equal({ ..._magicItems[0], active: false });
        });
    });
});

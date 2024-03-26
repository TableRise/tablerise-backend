import sinon from 'sinon';
import GetMagicItemService from 'src/core/dungeons&dragons5e/services/magicItems/GetMagicItemService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: GetMagicItemService', () => {
    let getMagicItemService: GetMagicItemService,
        dungeonsAndDragonsRepository: any,
        magicItem: any;

    const logger = (): void => {};

    context('When magicItem is recovered with success', () => {
        before(() => {
            magicItem = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'magicItems',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => magicItem[0]),
                setEntity: sinon.spy(() => {}),
            };

            getMagicItemService = new GetMagicItemService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const magicItemsTest = await getMagicItemService.get('123');

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'MagicItems'
            );
            expect(magicItemsTest).to.be.deep.equal(magicItem[0]);
        });
    });
});

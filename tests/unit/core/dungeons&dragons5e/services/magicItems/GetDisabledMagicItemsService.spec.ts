import sinon from 'sinon';
import GetDisabledMagicItemsService from 'src/core/dungeons&dragons5e/services/magicItems/GetDisabledMagicItemsService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: GetDisabledMagicItemsService', () => {
    let getDisabledMagicItemsService: GetDisabledMagicItemsService,
        dungeonsAndDragonsRepository: any,
        magicItems: any;

    const logger = (): void => {};

    context('When disabled magicItems are recovered with success', () => {
        before(() => {
            magicItems = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'magicItems',
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => magicItems),
                setEntity: sinon.spy(() => {}),
            };

            getDisabledMagicItemsService = new GetDisabledMagicItemsService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const magicItemsTest = await getDisabledMagicItemsService.getAllDisabled();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'MagicItems'
            );
            expect(magicItemsTest).to.be.deep.equal(magicItems);
        });
    });
});

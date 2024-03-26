import sinon from 'sinon';
import GetAllMagicItemsService from 'src/core/dungeons&dragons5e/services/magicItems/GetAllMagicItemsService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Services :: GetAllMagicItemsService', () => {
    let getAllMagicItemsService: GetAllMagicItemsService,
        dungeonsAndDragonsRepository: any,
        magicItems: any;

    const logger = (): void => {};

    context('When magicItems are recovered with success', () => {
        before(() => {
            magicItems = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'magicItems',
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => magicItems),
                setEntity: sinon.spy(() => {}),
            };

            getAllMagicItemsService = new GetAllMagicItemsService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const magicItemsTest = await getAllMagicItemsService.getAll();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'MagicItems'
            );
            expect(magicItemsTest).to.be.deep.equal(magicItems);
        });
    });
});

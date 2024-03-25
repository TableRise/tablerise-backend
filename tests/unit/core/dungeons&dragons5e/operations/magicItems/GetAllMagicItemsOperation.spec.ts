import sinon from 'sinon';
import GetAllMagicItemsOperation from 'src/core/dungeons&dragons5e/operations/magicItems/GetAllMagicItemsOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Operations :: GetAllMagicItemsOperation', () => {
    let getAllMagicItemsOperation: GetAllMagicItemsOperation,
        getAllMagicItemsService: any,
        magicItems: any;

    const logger = (): void => {};

    context('When magicItems are recovered with success', () => {
        before(() => {
            magicItems = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'magicItems',
            });

            getAllMagicItemsService = {
                getAll: sinon.spy(() => magicItems),
            };

            getAllMagicItemsOperation = new GetAllMagicItemsOperation({
                getAllMagicItemsService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const magicItemsTest = await getAllMagicItemsOperation.execute();

            expect(getAllMagicItemsService.getAll).to.have.been.called();
            expect(magicItemsTest).to.be.deep.equal(magicItems);
        });
    });
});

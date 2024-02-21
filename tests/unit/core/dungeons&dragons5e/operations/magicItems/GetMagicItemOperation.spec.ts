import sinon from 'sinon';
import GetMagicItemOperation from 'src/core/dungeons&dragons5e/operations/magicItems/GetMagicItemOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: GetMagicItemOperation', () => {
    let getMagicItemOperation: GetMagicItemOperation,
        getMagicItemService: any,
        magicItem: any;

    const logger = (): void => {};

    context('When magicItem is recovered with success', () => {
        before(() => {
            magicItem = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'magicItems',
            });

            getMagicItemService = {
                get: sinon.spy(() => magicItem[0]),
            };

            getMagicItemOperation = new GetMagicItemOperation({
                getMagicItemService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const magicItemTest = await getMagicItemOperation.execute('123');

            expect(getMagicItemService.get).to.have.been.called();
            expect(magicItemTest).to.be.deep.equal(magicItem[0]);
        });
    });
});

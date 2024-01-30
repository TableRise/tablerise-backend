import sinon from 'sinon';
import GetAllFeatsOperation from 'src/core/dungeons&dragons5e/operations/feats/GetAllFeatsOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Operations :: GetAllFeatsOperation', () => {
    let getAllFeatsOperation: GetAllFeatsOperation, getAllFeatsService: any, feats: any;

    const logger = (): void => {};

    context('When feats are recovered with success', () => {
        before(() => {
            feats = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'feats',
            });

            getAllFeatsService = {
                getAll: sinon.spy(() => feats),
            };

            getAllFeatsOperation = new GetAllFeatsOperation({
                getAllFeatsService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const featsTest = await getAllFeatsOperation.execute();

            expect(getAllFeatsService.getAll).to.have.been.called();
            expect(featsTest).to.be.deep.equal(feats);
        });
    });
});

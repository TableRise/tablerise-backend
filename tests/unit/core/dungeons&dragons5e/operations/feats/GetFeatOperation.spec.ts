import sinon from 'sinon';
import GetFeatOperation from 'src/core/dungeons&dragons5e/operations/feats/GetFeatOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: GetFeatOperation', () => {
    let getFeatOperation: GetFeatOperation, getFeatService: any, feat: any;

    const logger = (): void => {};

    context('When feats are recovered with success', () => {
        before(() => {
            feat = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'feats',
            });

            getFeatService = {
                get: sinon.spy(() => feat[0]),
            };

            getFeatOperation = new GetFeatOperation({
                getFeatService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const featTest = await getFeatOperation.execute('123');

            expect(getFeatService.get).to.have.been.called();
            expect(featTest).to.be.deep.equal(feat[0]);
        });
    });
});

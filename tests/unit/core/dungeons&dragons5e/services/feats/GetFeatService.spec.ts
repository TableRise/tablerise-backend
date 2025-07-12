import sinon from 'sinon';
import GetFeatService from 'src/core/dungeons&dragons5e/services/feats/GetFeatService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: GetFeatService', () => {
    let getFeatService: GetFeatService, dungeonsAndDragonsRepository: any, feat: any;

    const logger = (): void => {};

    context('When feat is recovered with success', () => {
        before(() => {
            feat = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'feats',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => feat[0]),
                setEntity: sinon.spy(() => {}),
            };

            getFeatService = new GetFeatService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const featsTest = await getFeatService.get('123');

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith('Feats');
            expect(featsTest).to.be.deep.equal(feat[0]);
        });
    });
});

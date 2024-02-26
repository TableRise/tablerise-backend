import sinon from 'sinon';
import GetAllFeatsService from 'src/core/dungeons&dragons5e/services/feats/GetAllFeatsService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Services :: GetAllFeatsService', () => {
    let getAllFeatsService: GetAllFeatsService, dungeonsAndDragonsRepository: any, feats: any;

    const logger = (): void => {};

    context('When feats are recovered with success', () => {
        before(() => {
            feats = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'feats',
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => feats),
                setEntity: sinon.spy(() => {}),
            };

            getAllFeatsService = new GetAllFeatsService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const featsTest = await getAllFeatsService.getAll();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith('Feats');
            expect(featsTest).to.be.deep.equal(feats);
        });
    });
});

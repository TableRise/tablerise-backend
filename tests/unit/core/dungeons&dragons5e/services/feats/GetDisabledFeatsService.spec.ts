import sinon from 'sinon';
import GetDisabledFeatsService from 'src/core/dungeons&dragons5e/services/feats/GetDisabledFeatsService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: GetDisabledFeatsService', () => {
    let getDisabledFeatsService: GetDisabledFeatsService,
        dungeonsAndDragonsRepository: any,
        feats: any;

    const logger = (): void => {};

    context('When disabled feats are recovered with success', () => {
        before(() => {
            feats = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'feats',
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => feats),
                setEntity: sinon.spy(() => {}),
            };

            getDisabledFeatsService = new GetDisabledFeatsService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const featsTest = await getDisabledFeatsService.getAllDisabled();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Feats'
            );
            expect(featsTest).to.be.deep.equal(feats);
        });
    });
});

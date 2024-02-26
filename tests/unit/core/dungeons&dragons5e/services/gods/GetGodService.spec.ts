import sinon from 'sinon';
import GetGodService from 'src/core/dungeons&dragons5e/services/gods/GetGodService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: GetGodService', () => {
    let getGodService: GetGodService, dungeonsAndDragonsRepository: any, god: any;

    const logger = (): void => {};

    context('When god is recovered with success', () => {
        before(() => {
            god = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'gods',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => god[0]),
                setEntity: sinon.spy(() => {}),
            };

            getGodService = new GetGodService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const godsTest = await getGodService.get('123');

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Gods'
            );
            expect(godsTest).to.be.deep.equal(god[0]);
        });
    });
});

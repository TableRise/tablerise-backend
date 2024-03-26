import sinon from 'sinon';
import GetAllGodsService from 'src/core/dungeons&dragons5e/services/gods/GetAllGodsService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Services :: GetAllGodsService', () => {
    let getAllGodsService: GetAllGodsService,
        dungeonsAndDragonsRepository: any,
        gods: any;

    const logger = (): void => {};

    context('When gods are recovered with success', () => {
        before(() => {
            gods = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'gods',
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => gods),
                setEntity: sinon.spy(() => {}),
            };

            getAllGodsService = new GetAllGodsService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const godsTest = await getAllGodsService.getAll();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Gods'
            );
            expect(godsTest).to.be.deep.equal(gods);
        });
    });
});

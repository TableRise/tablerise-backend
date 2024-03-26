import sinon from 'sinon';
import GetAllGodsOperation from 'src/core/dungeons&dragons5e/operations/gods/GetAllGodsOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Operations :: GetAllGodsOperation', () => {
    let getAllGodsOperation: GetAllGodsOperation, getAllGodsService: any, gods: any;

    const logger = (): void => {};

    context('When gods are recovered with success', () => {
        before(() => {
            gods = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'gods',
            });

            getAllGodsService = {
                getAll: sinon.spy(() => gods),
            };

            getAllGodsOperation = new GetAllGodsOperation({
                getAllGodsService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const godsTest = await getAllGodsOperation.execute();

            expect(getAllGodsService.getAll).to.have.been.called();
            expect(godsTest).to.be.deep.equal(gods);
        });
    });
});

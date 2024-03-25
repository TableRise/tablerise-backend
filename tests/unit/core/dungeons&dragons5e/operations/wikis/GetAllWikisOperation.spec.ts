import sinon from 'sinon';
import GetAllWikisOperation from 'src/core/dungeons&dragons5e/operations/wikis/GetAllWikisOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Operations :: GetAllWikisOperation', () => {
    let getAllWikisOperation: GetAllWikisOperation, getAllWikisService: any, wikis: any;

    const logger = (): void => {};

    context('When wikis are recovered with success', () => {
        before(() => {
            wikis = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'wikis',
            });

            getAllWikisService = {
                getAll: sinon.spy(() => wikis),
            };

            getAllWikisOperation = new GetAllWikisOperation({
                getAllWikisService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const wikisTest = await getAllWikisOperation.execute();

            expect(getAllWikisService.getAll).to.have.been.called();
            expect(wikisTest).to.be.deep.equal(wikis);
        });
    });
});

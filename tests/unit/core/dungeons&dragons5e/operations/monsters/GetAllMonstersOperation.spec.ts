import sinon from 'sinon';
import GetAllMonstersOperation from 'src/core/dungeons&dragons5e/operations/monsters/GetAllMonstersOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Operations :: GetAllMonstersOperation', () => {
    let getAllMonstersOperation: GetAllMonstersOperation,
        getAllMonstersService: any,
        monsters: any;

    const logger = (): void => {};

    context('When monsters are recovered with success', () => {
        before(() => {
            monsters = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 2,
                entity: 'monsters',
            });

            getAllMonstersService = {
                getAll: sinon.spy(() => monsters),
            };

            getAllMonstersOperation = new GetAllMonstersOperation({
                getAllMonstersService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const MonstersTest = await getAllMonstersOperation.execute();

            expect(getAllMonstersService.getAll).to.have.been.called();
            expect(MonstersTest).to.be.deep.equal(monsters);
        });
    });
});

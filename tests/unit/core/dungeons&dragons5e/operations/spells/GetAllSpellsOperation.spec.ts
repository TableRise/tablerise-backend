import sinon from 'sinon';
import GetAllSpellsOperation from 'src/core/dungeons&dragons5e/operations/spells/GetAllSpellsOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Operations :: GetAllSpellsOperation', () => {
    let getAllSpellsOperation: GetAllSpellsOperation,
        getAllSpellsService: any,
        spells: any;

    const logger = (): void => {};

    context('When spells are recovered with success', () => {
        before(() => {
            spells = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'spells',
            });

            getAllSpellsService = {
                getAll: sinon.spy(() => spells),
            };

            getAllSpellsOperation = new GetAllSpellsOperation({
                getAllSpellsService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const spellsTest = await getAllSpellsOperation.execute();

            expect(getAllSpellsService.getAll).to.have.been.called();
            expect(spellsTest).to.be.deep.equal(spells);
        });
    });
});

import sinon from 'sinon';
import GetAllBackgroundsOperation from 'src/core/dungeons&dragons5e/operations/backgrounds/GetAllBackgroundsOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe.only('Core :: Dungeons&Dragons5e :: Operations :: Backgrounds :: GetAllBackgroundsOperation', () => {
    let getAllBackgroundsOperation: GetAllBackgroundsOperation,
        getAllBackgroundsService: any,
        background: any;

    const logger = (): void => {};

    context('', () => {
        background = DomainDataFaker.generateDungeonsAndDragonsJSON({
            count: 1,
            entity: 'backgrounds',
        });

        getAllBackgroundsService = {
            getAll: sinon.spy(() => background),
        };

        getAllBackgroundsOperation = new GetAllBackgroundsOperation({
            getAllBackgroundsService,
            logger,
        });

        it('', async () => {
            const result = await getAllBackgroundsOperation.execute();

            expect(getAllBackgroundsService.getAll).to.have.been.called();
            expect(result).to.be.deep.equal(background);
        });
    });
});

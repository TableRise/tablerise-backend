import sinon from 'sinon';
import GetAllBackgroundsOperation from 'src/core/dungeons&dragons5e/operations/backgrounds/GetAllBackgroundsOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Operations :: GetAllBackgroundsOperation', () => {
    let getAllBackgroundsOperation: GetAllBackgroundsOperation,
        getAllBackgroundsService: any,
        backgrounds: any;

    const logger = (): void => {};

    context('When backgrounds are recovered with success', () => {
        before(() => {
            backgrounds = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'backgrounds',
            });

            getAllBackgroundsService = {
                getAll: sinon.spy(() => backgrounds),
            };

            getAllBackgroundsOperation = new GetAllBackgroundsOperation({
                getAllBackgroundsService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const backgroundsTest = await getAllBackgroundsOperation.execute();

            expect(getAllBackgroundsService.getAll).to.have.been.called();
            expect(backgroundsTest).to.be.deep.equal(backgrounds);
        });
    });
});
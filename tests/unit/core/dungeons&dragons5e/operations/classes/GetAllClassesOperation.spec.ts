import sinon from 'sinon';
import GetAllClassesOperation from 'src/core/dungeons&dragons5e/operations/classes/GetAllClassesOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Operations :: GetAllClassesOperation', () => {
    let getAllClassesOperation: GetAllClassesOperation, getAllClassesService: any, classes: any;

    const logger = (): void => {};

    context('When classes are recovered with success', () => {
        before(() => {
            classes = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'classes',
            });

            getAllClassesService = {
                getAll: sinon.spy(() => classes),
            };

            getAllClassesOperation = new GetAllClassesOperation({
                getAllClassesService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const classesTest = await getAllClassesOperation.execute();

            expect(getAllClassesService.getAll).to.have.been.called();
            expect(classesTest).to.be.deep.equal(classes);
        });
    });
});

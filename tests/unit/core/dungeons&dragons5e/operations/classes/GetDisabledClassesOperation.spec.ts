import sinon from 'sinon';
import GetDisabledClassesOperation from 'src/core/dungeons&dragons5e/operations/classes/GetDisabledClassesOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Operations :: GetDisabledClassesOperation', () => {
    let getDisabledClassesOperation: GetDisabledClassesOperation,
        getDisabledClassesService: any,
        classes: any;

    const logger = (): void => {};

    context('When classes are recovered with success', () => {
        before(() => {
            classes = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'classes',
            });

            classes.forEach((e: any) => {
                e.active = false;
            });

            getDisabledClassesService = {
                getAllDisabled: sinon.spy(() => classes),
            };

            getDisabledClassesOperation = new GetDisabledClassesOperation({
                getDisabledClassesService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const classesTest = await getDisabledClassesOperation.execute();

            expect(getDisabledClassesService.getAllDisabled).to.have.been.called();

            classesTest.forEach((e: any) => {
                expect(e.active).to.be.false();
            });
            expect(classesTest).to.be.deep.equal(classes);
        });
    });
});

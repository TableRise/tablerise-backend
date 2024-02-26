import sinon from 'sinon';
import GetDisabledClassesService from 'src/core/dungeons&dragons5e/services/classes/GetDisabledClassesService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Services :: GetDisabledClassesService', () => {
    let getDisabledClassesService: GetDisabledClassesService,
        dungeonsAndDragonsRepository: any,
        classes: any;

    const logger = (): void => {};

    context('When disabled classes are recovered with success', () => {
        before(() => {
            classes = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'classes',
            });

            classes.forEach((e: any) => {
                e.active = false;
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => classes),
                setEntity: sinon.spy(() => {}),
            };

            getDisabledClassesService = new GetDisabledClassesService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const classesTest = await getDisabledClassesService.getAllDisabled();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Classes'
            );
            classesTest.forEach((e: any) => {
                expect(e.active).to.be.false();
            });
            expect(classesTest).to.be.deep.equal(classes);
        });
    });
});

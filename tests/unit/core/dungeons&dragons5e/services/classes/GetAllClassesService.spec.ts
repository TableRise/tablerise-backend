import sinon from 'sinon';
import GetAllClassesService from 'src/core/dungeons&dragons5e/services/classes/GetAllClassesService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Services :: GetAllClassesService', () => {
    let getAllClassesService: GetAllClassesService, dungeonsAndDragonsRepository: any, classes: any;

    const logger = (): void => {};

    context('When classes are recovered with success', () => {
        before(() => {
            classes = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'classes',
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => classes),
                setEntity: sinon.spy(() => {}),
            };

            getAllClassesService = new GetAllClassesService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const classesTest = await getAllClassesService.getAll();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith('Classes');
            expect(dungeonsAndDragonsRepository.find).to.have.been.calledWith({ active: true });
            expect(classesTest).to.be.deep.equal(classes);
        });

        it('should filter the classes by name when provided', async () => {
            await getAllClassesService.getAll({ name: 'Wizard' });

            expect(dungeonsAndDragonsRepository.find).to.have.been.calledWith({
                active: true,
                name: { $regex: '^Wizard$', $options: 'i' },
            });
        });

        it('should filter the classes by name case-insensitively', async () => {
            await getAllClassesService.getAll({ name: 'wizard' });

            expect(dungeonsAndDragonsRepository.find).to.have.been.calledWith({
                active: true,
                name: { $regex: '^wizard$', $options: 'i' },
            });
        });

        it('should ignore blank class names', async () => {
            await getAllClassesService.getAll({ name: '   ' });

            expect(dungeonsAndDragonsRepository.find).to.have.been.calledWith({ active: true });
        });
    });
});

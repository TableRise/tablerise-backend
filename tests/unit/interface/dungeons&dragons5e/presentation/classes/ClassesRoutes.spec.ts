import ClassesController from 'src/interface/dungeons&dragons5e/presentation/classes/ClassesController';
import ClassesRoutes from 'src/interface/dungeons&dragons5e/presentation/classes/ClassesRoutes';

describe('Interface :: Dungeons&dragons5e :: Presentation :: Classes :: ClassesRoutes', () => {
    let classesRoutes: ClassesRoutes, classesController, verifyIdMiddleware;

    context('When all the routes are correctly implemented', () => {
        classesController = {} as ClassesController;
        verifyIdMiddleware = () => ({});

        classesRoutes = new ClassesRoutes({
            classesController,
            verifyIdMiddleware,
        });

        it('Should return the correct number of routes', () => {
            const routes = classesRoutes.routes();
            expect(routes).to.have.lengthOf(4);
        });
    });
});

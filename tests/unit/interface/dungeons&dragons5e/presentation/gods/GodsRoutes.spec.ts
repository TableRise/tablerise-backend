import GodsController from 'src/interface/dungeons&dragons5e/presentation/gods/GodsController';
import GodsRoutes from 'src/interface/dungeons&dragons5e/presentation/gods/GodsRoutes';

describe('Interface :: Dungeons&dragons5e :: Presentation :: Gods :: GodsRoutes', () => {
    let godsRoutes: GodsRoutes, godsController, verifyIdMiddleware;

    context('When all the routes are correctly implemented', () => {
        godsController = {} as GodsController;
        verifyIdMiddleware = () => ({});

        godsRoutes = new GodsRoutes({
            godsController,
            verifyIdMiddleware,
        });

        it('Should return the correct number of routes', () => {
            const routes = godsRoutes.routes();
            expect(routes).to.have.lengthOf(4);
        });
    });
});

import BackgroundsController from 'src/interface/dungeons&dragons5e/presentation/backgrounds/BackgroundsController';
import BackgroundsRoutes from 'src/interface/dungeons&dragons5e/presentation/backgrounds/BackgroundsRoutes';

describe('Interface :: Dungeons&dragons5e :: Presentation :: Backgrounds :: BackgroundsRoutes', () => {
    let backgroundsRoutes: BackgroundsRoutes, backgroundsController, verifyIdMiddleware;

    context('When all the routes are correctly implemented', () => {
        backgroundsController = {} as BackgroundsController;
        verifyIdMiddleware = () => ({});

        backgroundsRoutes = new BackgroundsRoutes({
            backgroundsController,
            verifyIdMiddleware,
        });

        it('Should return the correct number of routes', () => {
            const routes = backgroundsRoutes.routes();
            expect(routes).to.have.lengthOf(4);
        });
    });
});

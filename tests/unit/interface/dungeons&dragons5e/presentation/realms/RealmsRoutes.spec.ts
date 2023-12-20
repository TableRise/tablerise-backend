import RealmsController from 'src/interface/dungeons&dragons5e/presentation/realms/RealmsController';
import RealmsRoutes from 'src/interface/dungeons&dragons5e/presentation/realms/RealmsRoutes';

describe('Interface :: Dungeons&dragons5e :: Presentation :: Realms :: RealmsRoutes', () => {
    let realmsRoutes: RealmsRoutes, realmsController, verifyIdMiddleware;

    context('When all the routes are correctly implemented', () => {
        realmsController = {} as RealmsController;
        verifyIdMiddleware = () => ({});

        realmsRoutes = new RealmsRoutes({
            realmsController,
            verifyIdMiddleware,
        });

        it('Should return the correct number of routes', () => {
            const routes = realmsRoutes.routes();
            expect(routes).to.have.lengthOf(4);
        });
    });
});

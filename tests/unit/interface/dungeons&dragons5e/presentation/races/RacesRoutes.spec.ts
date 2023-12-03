import RacesController from 'src/interface/dungeons&dragons5e/presentation/races/RacesController';
import RacesRoutes from 'src/interface/dungeons&dragons5e/presentation/races/RacesRoutes';

describe('Interface :: Dungeons&dragons5e :: Presentation :: Races :: RacesRoutes', () => {
    let racesRoutes: RacesRoutes, racesController, verifyIdMiddleware;

    context('When all the routes are correctly implemented', () => {
        racesController = {} as RacesController;
        verifyIdMiddleware = () => ({});

        racesRoutes = new RacesRoutes({
            racesController,
            verifyIdMiddleware,
        });

        it('Should return the correct number of routes', () => {
            const routes = racesRoutes.routes();
            expect(routes).to.have.lengthOf(4);
        });
    });
});

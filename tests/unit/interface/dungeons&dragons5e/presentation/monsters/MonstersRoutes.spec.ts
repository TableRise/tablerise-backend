import MonstersController from 'src/interface/dungeons&dragons5e/presentation/monsters/MonstersController';
import MonstersRoutes from 'src/interface/dungeons&dragons5e/presentation/monsters/MonstersRoutes';

describe('Interface :: Dungeons&dragons5e :: Presentation :: Monsters :: MonstersRoutes', () => {
    let monstersRoutes: MonstersRoutes, monstersController, verifyIdMiddleware;

    context('When all the routes are correctly implemented', () => {
        monstersController = {} as MonstersController;
        verifyIdMiddleware = () => ({});

        monstersRoutes = new MonstersRoutes({
            monstersController,
            verifyIdMiddleware,
        });

        it('Should return the correct number of routes', () => {
            const routes = monstersRoutes.routes();
            expect(routes).to.have.lengthOf(4);
        });
    });
});

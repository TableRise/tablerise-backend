import WikisController from 'src/interface/dungeons&dragons5e/presentation/wikis/WikisController';
import WikisRoutes from 'src/interface/dungeons&dragons5e/presentation/wikis/WikisRoutes';

describe('Interface :: Dungeons&dragons5e :: Presentation :: Wikis :: WikisRoutes', () => {
    let wikisRoutes: WikisRoutes, wikisController, verifyIdMiddleware;

    context('When all the routes are correctly implemented', () => {
        wikisController = {} as WikisController;
        verifyIdMiddleware = () => ({});

        wikisRoutes = new WikisRoutes({
            wikisController,
            verifyIdMiddleware,
        });

        it('Should return the correct number of routes', () => {
            const routes = wikisRoutes.routes();
            expect(routes).to.have.lengthOf(4);
        });
    });
});
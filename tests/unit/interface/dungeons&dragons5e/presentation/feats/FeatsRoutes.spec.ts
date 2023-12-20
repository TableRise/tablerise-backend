import FeatsController from 'src/interface/dungeons&dragons5e/presentation/feats/FeatsController';
import FeatsRoutes from 'src/interface/dungeons&dragons5e/presentation/feats/FeatsRoutes';

describe('Interface :: Dungeons&dragons5e :: Presentation :: Feats :: FeatsRoutes', () => {
    let featsRoutes: FeatsRoutes, featsController, verifyIdMiddleware;

    context('When all the routes are correctly implemented', () => {
        featsController = {} as FeatsController;
        verifyIdMiddleware = () => ({});

        featsRoutes = new FeatsRoutes({
            featsController,
            verifyIdMiddleware,
        });

        it('Should return the correct number of routes', () => {
            const routes = featsRoutes.routes();
            expect(routes).to.have.lengthOf(4);
        });
    });
});

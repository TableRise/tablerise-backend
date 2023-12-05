import MagicItemsController from 'src/interface/dungeons&dragons5e/presentation/magicItems/MagicItemsController';
import MagicItemsRoutes from 'src/interface/dungeons&dragons5e/presentation/magicItems/MagicItemsRoutes';

describe('Interface :: Dungeons&dragons5e :: Presentation :: MagicItems :: MagicItemsRoutes', () => {
    let magicItemsRoutes: MagicItemsRoutes, magicItemsController, verifyIdMiddleware;

    context('When all the routes are correctly implemented', () => {
        magicItemsController = {} as MagicItemsController;
        verifyIdMiddleware = () => ({});

        magicItemsRoutes = new MagicItemsRoutes({
            magicItemsController,
            verifyIdMiddleware,
        });

        it('Should return the correct number of routes', () => {
            const routes = magicItemsRoutes.routes();
            expect(routes).to.have.lengthOf(4);
        });
    });
});

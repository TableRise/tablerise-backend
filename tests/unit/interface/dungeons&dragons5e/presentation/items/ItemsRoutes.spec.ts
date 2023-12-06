import ItemsController from 'src/interface/dungeons&dragons5e/presentation/items/ItemsController';
import ItemsRoutes from 'src/interface/dungeons&dragons5e/presentation/items/ItemsRoutes';

describe('Interface :: Dungeons&dragons5e :: Presentation :: Items :: ItemsRoutes', () => {
    let itemsRoutes: ItemsRoutes, itemsController, verifyIdMiddleware;

    context('When all the routes are correctly implemented', () => {
        itemsController = {} as ItemsController;
        verifyIdMiddleware = () => ({});

        itemsRoutes = new ItemsRoutes({
            itemsController,
            verifyIdMiddleware,
        });

        it('Should return the correct number of routes', () => {
            const routes = itemsRoutes.routes();
            expect(routes).to.have.lengthOf(4);
        });
    });
});

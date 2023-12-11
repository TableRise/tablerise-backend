import WeaponsController from 'src/interface/dungeons&dragons5e/presentation/weapons/WeaponsController';
import WeaponsRoutes from 'src/interface/dungeons&dragons5e/presentation/weapons/WeaponsRoutes';

describe('Interface :: Dungeons&dragons5e :: Presentation :: Weapons :: WeaponsRoutes', () => {
    let weaponsRoutes: WeaponsRoutes, weaponsController, verifyIdMiddleware;

    context('When all the routes are correctly implemented', () => {
        weaponsController = {} as WeaponsController;
        verifyIdMiddleware = () => ({});

        weaponsRoutes = new WeaponsRoutes({
            weaponsController,
            verifyIdMiddleware,
        });

        it('Should return the correct number of routes', () => {
            const routes = weaponsRoutes.routes();
            expect(routes).to.have.lengthOf(4);
        });
    });
});

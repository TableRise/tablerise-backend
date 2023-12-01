import ArmorsController from 'src/interface/dungeons&dragons5e/presentation/armors/ArmorsController';
import ArmorsRoutes from 'src/interface/dungeons&dragons5e/presentation/armors/ArmorsRoutes';

describe('Interface :: Dungeons&dragons5e :: Presentation :: Armors :: ArmorsRoutes', () => {
    let armorsRoutes: ArmorsRoutes, armorsController, verifyIdMiddleware;

    context('When all the routes are correctly implemented', () => {
        armorsController = {} as ArmorsController;
        verifyIdMiddleware = () => ({});

        armorsRoutes = new ArmorsRoutes({
            armorsController,
            verifyIdMiddleware,
        });

        it('Should return the correct number of routes', () => {
            const routes = armorsRoutes.routes();
            expect(routes).to.have.lengthOf(4);
        });
    });
});

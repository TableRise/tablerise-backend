import passport from 'passport';
import sinon from 'sinon';
import EquipmentController from 'src/interface/dungeons&dragons5e/presentation/equipment/EquipmentController';
import EquipmentRoutes from 'src/interface/dungeons&dragons5e/presentation/equipment/EquipmentRoutes';

describe('Interface :: Dungeons&dragons5e :: Presentation :: Equipment :: EquipmentRoutes', () => {
    let equipmentRoutes: EquipmentRoutes;
    let equipmentController: Record<string, sinon.SinonStub>;
    let verifyIdMiddleware: sinon.SinonStub;
    let authenticateStub: sinon.SinonStub;
    let cookieMiddleware: sinon.SinonStub;

    beforeEach(() => {
        equipmentController = {
            get: sinon.stub(),
            getAll: sinon.stub(),
            getDisabled: sinon.stub(),
            toggleAvailability: sinon.stub(),
        };
        verifyIdMiddleware = sinon.stub();
        cookieMiddleware = sinon.stub();
        authenticateStub = sinon.stub(passport, 'authenticate').returns(cookieMiddleware as any);

        equipmentRoutes = new EquipmentRoutes({
            equipmentController: equipmentController as unknown as EquipmentController,
            verifyIdMiddleware,
        });
    });

    afterEach(() => {
        authenticateStub.restore();
    });

    context('When all the routes are correctly implemented', () => {
        it('should return the current route table and parse the availability query', () => {
            const routes = equipmentRoutes.routes();

            expect(routes).to.have.lengthOf(5);
            expect(routes[0]).to.deep.equal({ basePath: '/system/dnd5e/equipment' });
            expect(routes[1].controller).to.equal(equipmentController.getAll);
            expect(routes[2].controller).to.equal(equipmentController.getDisabled);
            expect(routes[3].controller).to.equal(equipmentController.get);
            expect(routes[4].controller).to.equal(equipmentController.toggleAvailability);
            expect(routes[3].options.middlewares).to.deep.equal([verifyIdMiddleware, cookieMiddleware]);
            expect(routes[4].options.middlewares).to.deep.equal([verifyIdMiddleware, cookieMiddleware]);
            expect(authenticateStub.callCount).to.equal(4);

            const availabilitySchema = routes[4].options.schemas[0].query;

            expect(availabilitySchema.parse({ availability: 'true' })).to.deep.equal({ availability: true });
            expect(availabilitySchema.parse({ availability: false })).to.deep.equal({ availability: false });
        });
    });
});

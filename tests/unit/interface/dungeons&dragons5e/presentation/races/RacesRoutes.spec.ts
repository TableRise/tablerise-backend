import passport from 'passport';
import sinon from 'sinon';
import RacesController from 'src/interface/dungeons&dragons5e/presentation/races/RacesController';
import RacesRoutes from 'src/interface/dungeons&dragons5e/presentation/races/RacesRoutes';

describe('Interface :: Dungeons&dragons5e :: Presentation :: Races :: RacesRoutes', () => {
    let racesRoutes: RacesRoutes;
    let racesController: Record<string, sinon.SinonStub>;
    let verifyIdMiddleware: sinon.SinonStub;
    let authenticateStub: sinon.SinonStub;
    let cookieMiddleware: sinon.SinonStub;

    beforeEach(() => {
        racesController = {
            get: sinon.stub(),
            getAll: sinon.stub(),
            getDisabled: sinon.stub(),
            toggleAvailability: sinon.stub(),
        };
        verifyIdMiddleware = sinon.stub();
        cookieMiddleware = sinon.stub();
        authenticateStub = sinon.stub(passport, 'authenticate').returns(cookieMiddleware as any);

        racesRoutes = new RacesRoutes({
            racesController: racesController as unknown as RacesController,
            verifyIdMiddleware,
        });
    });

    afterEach(() => {
        authenticateStub.restore();
    });

    context('When all the routes are correctly implemented', () => {
        it('should return the current route table and parse the availability query', () => {
            const routes = racesRoutes.routes();

            expect(routes).to.have.lengthOf(5);
            expect(routes[0]).to.deep.equal({ basePath: '/system/dnd5e/races' });
            expect(routes[1].controller).to.equal(racesController.getAll);
            expect(routes[2].controller).to.equal(racesController.getDisabled);
            expect(routes[3].controller).to.equal(racesController.get);
            expect(routes[4].controller).to.equal(racesController.toggleAvailability);
            expect(routes[3].options.middlewares).to.deep.equal([verifyIdMiddleware, cookieMiddleware]);
            expect(routes[4].options.middlewares).to.deep.equal([verifyIdMiddleware, cookieMiddleware]);
            expect(authenticateStub.callCount).to.equal(4);

            const availabilitySchema = routes[4].options.schemas[0].query;

            expect(availabilitySchema.parse({ availability: 'false' })).to.deep.equal({ availability: false });
            expect(availabilitySchema.parse({ availability: true })).to.deep.equal({ availability: true });
        });
    });
});

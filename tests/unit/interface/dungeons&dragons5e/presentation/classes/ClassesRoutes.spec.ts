import passport from 'passport';
import sinon from 'sinon';
import ClassesController from 'src/interface/dungeons&dragons5e/presentation/classes/ClassesController';
import ClassesRoutes from 'src/interface/dungeons&dragons5e/presentation/classes/ClassesRoutes';

describe('Interface :: Dungeons&dragons5e :: Presentation :: Classes :: ClassesRoutes', () => {
    let classesRoutes: ClassesRoutes;
    let classesController: Record<string, sinon.SinonStub>;
    let verifyIdMiddleware: sinon.SinonStub;
    let authenticateStub: sinon.SinonStub;
    let cookieMiddleware: sinon.SinonStub;

    beforeEach(() => {
        classesController = {
            get: sinon.stub(),
            getAll: sinon.stub(),
            getDisabled: sinon.stub(),
            toggleAvailability: sinon.stub(),
        };
        verifyIdMiddleware = sinon.stub();
        cookieMiddleware = sinon.stub();
        authenticateStub = sinon.stub(passport, 'authenticate').returns(cookieMiddleware as any);

        classesRoutes = new ClassesRoutes({
            classesController: classesController as unknown as ClassesController,
            verifyIdMiddleware,
        });
    });

    afterEach(() => {
        authenticateStub.restore();
    });

    context('When all the routes are correctly implemented', () => {
        it('should return the current route table and parse the availability query', () => {
            const routes = classesRoutes.routes();

            expect(routes).to.have.lengthOf(5);
            expect(routes[0]).to.deep.equal({ basePath: '/system/dnd5e/classes' });
            expect(routes[1].controller).to.equal(classesController.getAll);
            expect(routes[2].controller).to.equal(classesController.getDisabled);
            expect(routes[3].controller).to.equal(classesController.get);
            expect(routes[4].controller).to.equal(classesController.toggleAvailability);
            expect(routes[3].options.middlewares).to.deep.equal([verifyIdMiddleware, cookieMiddleware]);
            expect(routes[4].options.middlewares).to.deep.equal([verifyIdMiddleware, cookieMiddleware]);
            expect(authenticateStub.callCount).to.equal(4);

            const availabilitySchema = routes[4].options.schemas[0].query;

            expect(availabilitySchema.parse({ availability: 'false' })).to.deep.equal({ availability: false });
            expect(availabilitySchema.parse({ availability: true })).to.deep.equal({ availability: true });
        });
    });
});

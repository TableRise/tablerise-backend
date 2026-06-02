import passport from 'passport';
import sinon from 'sinon';
import SpellsController from 'src/interface/dungeons&dragons5e/presentation/spells/SpellsController';
import SpellsRoutes from 'src/interface/dungeons&dragons5e/presentation/spells/SpellsRoutes';

describe('Interface :: Dungeons&dragons5e :: Presentation :: Spells :: SpellsRoutes', () => {
    let spellsRoutes: SpellsRoutes;
    let spellsController: Record<string, sinon.SinonStub>;
    let verifyIdMiddleware: sinon.SinonStub;
    let authenticateStub: sinon.SinonStub;
    let cookieMiddleware: sinon.SinonStub;

    beforeEach(() => {
        spellsController = {
            get: sinon.stub(),
            getAll: sinon.stub(),
            getDisabled: sinon.stub(),
            getByLevel: sinon.stub(),
            toggleAvailability: sinon.stub(),
        };
        verifyIdMiddleware = sinon.stub();
        cookieMiddleware = sinon.stub();
        authenticateStub = sinon.stub(passport, 'authenticate').returns(cookieMiddleware as any);

        spellsRoutes = new SpellsRoutes({
            spellsController: spellsController as unknown as SpellsController,
            verifyIdMiddleware,
        });
    });

    afterEach(() => {
        authenticateStub.restore();
    });

    context('When all the routes are correctly implemented', () => {
        it('should return the current route table and parse the supported queries', () => {
            const routes = spellsRoutes.routes();

            expect(routes).to.have.lengthOf(6);
            expect(routes[0]).to.deep.equal({ basePath: '/system/dnd5e/spells' });
            expect(routes[1].controller).to.equal(spellsController.getAll);
            expect(routes[2].controller).to.equal(spellsController.getDisabled);
            expect(routes[3].controller).to.equal(spellsController.getByLevel);
            expect(routes[4].controller).to.equal(spellsController.get);
            expect(routes[5].controller).to.equal(spellsController.toggleAvailability);
            expect(routes[4].options.middlewares).to.deep.equal([verifyIdMiddleware, cookieMiddleware]);
            expect(routes[5].options.middlewares).to.deep.equal([verifyIdMiddleware, cookieMiddleware]);
            expect(authenticateStub.callCount).to.equal(5);

            const byLevelSchema = routes[3].options.schemas[0].query;
            const availabilitySchema = routes[5].options.schemas[0].query;

            expect(byLevelSchema.parse({ queryLevel: '2' })).to.deep.equal({ queryLevel: 2 });
            expect(byLevelSchema.parse({ queryLevel: 3 })).to.deep.equal({ queryLevel: 3 });
            expect(availabilitySchema.parse({ availability: 'true' })).to.deep.equal({ availability: true });
            expect(availabilitySchema.parse({ availability: false })).to.deep.equal({ availability: false });
        });
    });
});

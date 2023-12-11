import SpellsController from 'src/interface/dungeons&dragons5e/presentation/spells/SpellsController';
import SpellsRoutes from 'src/interface/dungeons&dragons5e/presentation/spells/SpellsRoutes';

describe('Interface :: Dungeons&dragons5e :: Presentation :: Spells :: SpellsRoutes', () => {
    let spellsRoutes: SpellsRoutes, spellsController, verifyIdMiddleware;

    context('When all the routes are correctly implemented', () => {
        spellsController = {} as SpellsController;
        verifyIdMiddleware = () => ({});

        spellsRoutes = new SpellsRoutes({
            spellsController,
            verifyIdMiddleware,
        });

        it('Should return the correct number of routes', () => {
            const routes = spellsRoutes.routes();
            expect(routes).to.have.lengthOf(4);
        });
    });
});

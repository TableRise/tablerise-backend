import CharactersRoutes from 'src/interface/characters/presentation/character/CharactersRoutes';

describe('Interface :: Characters :: Presentation :: Characters :: CharactersRoutes', () => {
    let charactersRoutes: CharactersRoutes,
        charactersController: any,
        verifyIdMiddleware: any,
        imageMiddleware: any;

    context('When all the routes are correctly implemented', () => {
        charactersController = {};
        verifyIdMiddleware = () => ({});
        imageMiddleware = { multer: () => ({ single: () => {} }) };

        charactersRoutes = new CharactersRoutes({
            charactersController,
            verifyIdMiddleware,
            imageMiddleware,
        });

        it('Should return the correct number of routes', () => {
            const routes = charactersRoutes.routes();
            expect(routes).to.have.lengthOf(4);
        });
    });
});

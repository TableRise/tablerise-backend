import CharactersRoutes from 'src/interface/characters/presentation/character/CharactersRoutes';

describe('Interface :: Characters :: Presentation :: Characters :: CharactersRoutes', () => {
    let charactersRoutes: CharactersRoutes,
        charactersController: any,
        verifyIdMiddleware: any,
        imageMiddleware: any,
        authorizationMiddleware: any;

    context('When all the routes are correctly implemented', () => {
        charactersController = {};
        verifyIdMiddleware = () => ({});
        authorizationMiddleware = () => ({});
        imageMiddleware = { multer: () => ({ single: () => {} }) };

        charactersRoutes = new CharactersRoutes({
            charactersController,
            verifyIdMiddleware,
            imageMiddleware,
            authorizationMiddleware,
        });

        it('Should return the correct number of routes', () => {
            const routes = charactersRoutes.routes();
            expect(routes).to.have.lengthOf(2);
        });
    });
});

import CharactersRoutes from 'src/interface/characters/presentation/character/CharactersRoutes';

describe('Interface :: Characters :: Presentation :: Characters :: CharactersRoutes', () => {
    let charactersRoutes: CharactersRoutes,
        charactersController: any,
        verifyIdMiddleware: any,
        authorizationMiddleware: any,
        imageMiddleware: any,
        charactersSchemas: any;

    context('When all the routes are correctly implemented', () => {
        charactersController = {};
        verifyIdMiddleware = () => ({});
        imageMiddleware = { multer: () => ({ single: () => {} }) };
        authorizationMiddleware = { checkAdminRole: () => {} };
        charactersSchemas = {
            postCreateCharacter: { body: {} },
            putUpdateCharacter: { body: {} },
        };

        charactersRoutes = new CharactersRoutes({
            charactersController,
            verifyIdMiddleware,
            imageMiddleware,
            authorizationMiddleware,
            charactersSchemas,
        });

        it('Should return the correct number of routes', () => {
            const routes = charactersRoutes.routes();
            expect(routes).to.have.lengthOf(7);
        });
    });
});

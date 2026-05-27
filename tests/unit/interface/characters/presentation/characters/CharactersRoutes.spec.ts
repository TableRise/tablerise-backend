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
            postCharacterPicture: { body: {} },
            postOrganizationPicture: { query: {} },
            patchUpdateMoney: { body: {} },
        };

        charactersRoutes = new CharactersRoutes({
            charactersController,
            verifyIdMiddleware,
            imageMiddleware,
            authorizationMiddleware,
            charactersSchemas,
        });

        it('should return the correct number of routes and register the delete endpoint', () => {
            const routes = charactersRoutes.routes();
            expect(routes).to.have.lengthOf(10);
            expect(routes.some((route) => route.method === 'delete' && route.path === '/characters/:id/delete')).to.be
                .true;
        });
    });
});

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
            patchAddEquipment: { query: {} },
            patchRemoveEquipment: { query: {} },
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
            expect(routes).to.have.lengthOf(11);
            expect(routes.some((route) => route.method === 'delete' && route.path === '/:id/delete')).to.be.true;
            expect(routes.some((route) => route.method === 'patch' && route.path === '/:id/update/notifications/off'))
                .to.be.true;
            expect(routes.some((route) => route.method === 'post' && route.path === '/:id/symbol')).to.be.false;
        });
    });
});

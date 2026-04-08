import 'src/interface/common/strategies/CookieStrategy';

import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import desc from 'src/interface/characters/presentation/character/RoutesDescription';
import generateIDParam, { generateQueryParam } from 'src/domains/common/helpers/parametersWrapper';

const BASE_PATH = '/characters';

export default class CharactersRoutes {
    private readonly charactersController;
    private readonly verifyIdMiddleware;
    private readonly imageMiddleware;
    private readonly authorizationMiddleware;
    private readonly charactersSchemas;

    constructor({
        charactersController,
        verifyIdMiddleware,
        imageMiddleware,
        authorizationMiddleware,
        charactersSchemas,
    }: InterfaceDependencies['charactersRoutesContract']) {
        this.charactersController = charactersController;
        this.verifyIdMiddleware = verifyIdMiddleware;
        this.imageMiddleware = imageMiddleware;
        this.authorizationMiddleware = authorizationMiddleware;
        this.charactersSchemas = charactersSchemas;
    }

    public routes(): routeInstance[] {
        return [
            // GET
            {
                method: 'get',
                path: `${BASE_PATH}`,
                controller: this.charactersController.getAll,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.authorizationMiddleware.checkAdminRole,
                    ],
                    tag: 'recover',
                    description: desc.getAll,
                },
            },
            {
                method: 'get',
                parameters: [...generateIDParam()],
                path: `${BASE_PATH}/:id`,
                controller: this.charactersController.getById,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    tag: 'recover',
                    description: desc.getById,
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/by-campaign/:id`,
                controller: this.charactersController.recoverCharactersByCampaign,
                parameters: [...generateIDParam()],
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    description: desc.getByCampaign,
                    tag: 'recover',
                },
            },

            // POST
            {
                method: 'post',
                path: `${BASE_PATH}/create`,
                controller: this.charactersController.createCharacter,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    schemas: [{ body: this.charactersSchemas.postCreateCharacter.body }],
                    description: desc.create,
                    tag: 'create',
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/:id/picture`,
                controller: this.charactersController.updateCharacterPicture,
                parameters: [...generateIDParam()],
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.verifyIdMiddleware,
                        this.imageMiddleware.multer().single('picture'),
                        this.imageMiddleware.fileType,
                    ],
                    description: desc.updatePicture,
                    schemas: [{ body: this.charactersSchemas.postCharacterPicture.body }],
                    tag: 'management',
                    fileUpload: true,
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/:id/symbol`,
                parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'orgName', type: 'text' }])],
                controller: this.charactersController.organizationPicture,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.imageMiddleware.multer().single('picture'),
                        this.imageMiddleware.fileType,
                        this.verifyIdMiddleware,
                    ],
                    tag: 'management',
                    schemas: [
                        {
                            query: this.charactersSchemas.postOrganizationPicture.query,
                            body: this.charactersSchemas.postCharacterPicture.body,
                        },
                    ],
                    description: desc.orgSymbol,
                    fileUpload: true,
                },
            },

            // PUT
            {
                method: 'put',
                path: `${BASE_PATH}/:id`,
                controller: this.charactersController.updateCharacter,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [{ body: this.charactersSchemas.putUpdateCharacter.body }],
                    description: desc.update,
                    tag: 'management',
                },
            },
            // PATCH
        ] as routeInstance[];
    }
}

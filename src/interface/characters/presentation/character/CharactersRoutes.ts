import 'src/interface/common/strategies/CookieStrategy';

import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import desc from 'src/interface/characters/presentation/character/RoutesDescription';

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
            { basePath: BASE_PATH },
            // GET
            {
                method: 'get',
                path: '/',
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
                path: '/:id',
                controller: this.charactersController.getById,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    tag: 'recover',
                    description: desc.getById,
                },
            },
            // POST
            {
                method: 'post',
                path: '/create',
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
                path: '/:id/picture',
                controller: this.charactersController.updateCharacterPicture,
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

            // PUT
            {
                method: 'put',
                path: '/:id/update',
                controller: this.charactersController.updateCharacter,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [{ body: this.charactersSchemas.putUpdateCharacter.body }],
                    description: desc.update,
                    tag: 'management',
                },
            },

            // PATCH
            {
                method: 'patch',
                path: '/:id/update/equipments/add',
                controller: this.charactersController.addEquipment,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [{ query: this.charactersSchemas.patchAddEquipment.query }],
                    tag: 'management',
                    description: desc.addEquipment,
                },
            },
            {
                method: 'patch',
                path: '/:id/update/equipments/remove',
                controller: this.charactersController.removeEquipment,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [{ query: this.charactersSchemas.patchRemoveEquipment.query }],
                    tag: 'management',
                    description: desc.removeEquipment,
                },
            },
            {
                method: 'patch',
                path: '/:id/update/money',
                controller: this.charactersController.updateCharacterMoney,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [{ body: this.charactersSchemas.patchUpdateMoney.body }],
                    tag: 'management',
                    description: desc.updateMoney,
                },
            },
            {
                method: 'patch',
                path: '/:id/update/notifications/off',
                controller: this.charactersController.turnOffNotifications,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    tag: 'management',
                    description: desc.turnOffNotifications,
                },
            },
            {
                method: 'delete',
                path: '/:id/delete',
                controller: this.charactersController.deleteCharacter,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    tag: 'management',
                    description: desc.deleteCharacter,
                },
            },
        ] as unknown as routeInstance[];
    }
}

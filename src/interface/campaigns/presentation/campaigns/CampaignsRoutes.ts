import 'src/interface/common/strategies/CookieStrategy';

import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import desc from 'src/interface/campaigns/presentation/campaigns/RoutesDescription';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import generateIDParam, { generateQueryParam } from 'src/domains/common/helpers/parametersWrapper';

const BASE_PATH = '/campaigns';

export default class CampaignsRoutes {
    private readonly campaignsController;
    private readonly verifyIdMiddleware;
    private readonly imageMiddleware;
    private readonly verifyMatchMiddleware;
    private readonly campaignsSchemas;

    constructor({
        campaignsController,
        verifyIdMiddleware,
        imageMiddleware,
        verifyMatchMiddleware,
        campaignsSchemas,
    }: InterfaceDependencies['campaignsRoutesContract']) {
        this.campaignsController = campaignsController;
        this.verifyIdMiddleware = verifyIdMiddleware;
        this.imageMiddleware = imageMiddleware;
        this.verifyMatchMiddleware = verifyMatchMiddleware;
        this.campaignsSchemas = campaignsSchemas;
    }

    public routes(): routeInstance[] {
        return [
            // GET
            {
                method: 'get',
                path: `${BASE_PATH}/:id`,
                parameters: [...generateIDParam()],
                controller: this.campaignsController.getById,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    description: desc.getById,
                    tag: 'recover',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}`,
                controller: this.campaignsController.getAll,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'recover',
                    description: desc.getAll,
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/user/:id`,
                controller: this.campaignsController.getByUserId,
                parameters: [...generateIDParam()],
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    tag: 'recover',
                    description: desc.getAll,
                },
            },

            // POST
            {
                method: 'post',
                path: `${BASE_PATH}/create`,
                controller: this.campaignsController.create,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.imageMiddleware.multer().single('cover'),
                        this.imageMiddleware.fileType,
                    ],
                    schemas: [{ body: this.campaignsSchemas.postCreateCampaign.body }],
                    description: desc.create,
                    tag: 'create',
                    fileUpload: true,
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/:id/publishment`,
                parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'userId', type: 'string' }])],
                controller: this.campaignsController.publishment,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [{ body: this.campaignsSchemas.postCreateCampaignPublishment.body }],
                    description: desc.publishment,
                    tag: 'create',
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/:id/invite`,
                parameters: [...generateIDParam()],
                controller: this.campaignsController.inviteEmail,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [{ query: this.campaignsSchemas.postInvitePlayerByEmail.query }],
                    tag: 'management',
                    description: desc.inviteEmail,
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/:id/ban`,
                parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'playerId', type: 'string' }])],
                controller: this.campaignsController.banPlayer,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [{ query: this.campaignsSchemas.postBanCampaignPlayer.query }],
                    tag: 'ban',
                    description: desc.banPlayer,
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/:id/update/player/add`,
                parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'password', type: 'string' }])],
                controller: this.campaignsController.addCampaignPlayers,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [{ query: this.campaignsSchemas.postAddCampaignPlayers.query }],
                    description: desc.addCampaignPlayers,
                    tag: 'management',
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/:id/update/player/remove`,
                parameters: [...generateIDParam()],
                controller: this.campaignsController.removeCampaignPlayers,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    description: desc.removeCampaignPlayers,
                    tag: 'management',
                },
            },

            // PUT
            {
                method: 'put',
                path: `${BASE_PATH}/:id/update`,
                parameters: [...generateIDParam()],
                controller: this.campaignsController.update,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.imageMiddleware.multer().single('cover'),
                        this.imageMiddleware.fileType,
                        this.verifyIdMiddleware,
                    ],
                    schemas: [{ body: this.campaignsSchemas.putUpdateCampaign.body }],
                    description: desc.update,
                    tag: 'update',
                    fileUpload: true,
                },
            },

            // PATCH
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/match/map-images`,
                parameters: [...generateIDParam()],
                controller: this.campaignsController.updateMatchMapImages,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.imageMiddleware.multer().single('picture'),
                        this.imageMiddleware.fileType,
                        this.verifyIdMiddleware,
                        this.verifyMatchMiddleware.exists,
                    ],
                    schemas: [{ body: this.campaignsSchemas.patchUpdateCampaignMatchMapImages.body }],
                    description: desc.updateMatchImages,
                    tag: 'update',
                    fileUpload: true,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/match/musics`,
                parameters: [...generateIDParam()],
                controller: this.campaignsController.updateMatchMusics,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.verifyIdMiddleware,
                        this.verifyMatchMiddleware.exists,
                    ],
                    description: desc.updateMatchMusics,
                    schemas: [{ body: this.campaignsSchemas.patchUpdateCampaignMatchMusics.body }],
                    tag: 'update',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/infos/match-dates`,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(2, [
                        { name: 'date', type: 'string' },
                        { name: 'operation', type: 'string' },
                    ]),
                ],
                controller: this.campaignsController.updateMatchDate,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [{ query: this.campaignsSchemas.patchUpdateCampaignMatchDate.query }],
                    description: desc.updateMatchDate,
                    tag: 'update',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/player/character`,
                parameters: [...generateIDParam()],
                controller: this.campaignsController.addPlayerCharacter,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    description: desc.addPlayerCharacter,
                    schemas: [{ query: this.campaignsSchemas.patchUpdateCampaignPlayerCharacter.query }],
                    tag: 'management',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/images`,
                parameters: [...generateIDParam()],
                controller: this.campaignsController.updateCampaignImages,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.imageMiddleware.multer().single('picture'),
                        this.imageMiddleware.fileType,
                        this.verifyIdMiddleware,
                        this.verifyMatchMiddleware.exists,
                    ],
                    description: desc.updateCampaignImages,
                    schemas: [{ body: this.campaignsSchemas.patchUpdateCampaignImages.body }],
                    tag: 'update',
                    fileUpload: true,
                },
            },
        ] as routeInstance[];
    }
}

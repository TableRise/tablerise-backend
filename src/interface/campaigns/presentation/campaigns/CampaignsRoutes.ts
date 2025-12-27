import 'src/interface/common/strategies/CookieStrategy';

import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import desc from 'src/interface/campaigns/presentation/campaigns/RoutesDescription';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import generateIDParam, { generateQueryParam } from 'src/domains/common/helpers/parametersWrapper';

const BASE_PATH = '/campaigns';

export default class CampaignsRoutes {
    private readonly campaignsController;
    private readonly verifyIdMiddleware;
    private readonly imageMiddleware;
    private readonly verifyMatchMiddleware;

    constructor({
        campaignsController,
        verifyIdMiddleware,
        imageMiddleware,
        verifyMatchMiddleware,
    }: InterfaceDependencies['campaignsRoutesContract']) {
        this.campaignsController = campaignsController;
        this.verifyIdMiddleware = verifyIdMiddleware;
        this.imageMiddleware = imageMiddleware;
        this.verifyMatchMiddleware = verifyMatchMiddleware;
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
                schema: DomainDataFaker.mocks.createCampaignMock,
                controller: this.campaignsController.create,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.imageMiddleware.multer().single('cover'),
                        this.imageMiddleware.fileType,
                    ],
                    description: desc.create,
                    tag: 'create',
                    fileUpload: true,
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/:id/publishment`,
                schema: DomainDataFaker.mocks.publishment,
                parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'userId', type: 'string' }])],
                controller: this.campaignsController.publishment,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    description: desc.publishment,
                    tag: 'create',
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/:id/invite`,
                parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'targetEmail', type: 'string' }])],
                controller: this.campaignsController.inviteEmail,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
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
                    middlewares: [passport.authenticate('cookie', { session: false })],
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
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    description: desc.removeCampaignPlayers,
                    tag: 'management',
                },
            },

            // PUT
            {
                method: 'put',
                path: `${BASE_PATH}/:id/update`,
                parameters: [...generateIDParam()],
                schema: DomainDataFaker.mocks.updateCampaign,
                controller: this.campaignsController.update,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.imageMiddleware.multer().single('cover'),
                        this.imageMiddleware.fileType,
                    ],
                    description: desc.update,
                    tag: 'update',
                    fileUpload: true,
                },
            },

            // PATCH
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/match/map-images`,
                parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'operation', type: 'string' }])],
                controller: this.campaignsController.updateMatchMapImages,
                schema: DomainDataFaker.mocks.uploadMatchMapImage,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.imageMiddleware.multer().single('mapImage'),
                        this.imageMiddleware.fileType,
                        this.verifyMatchMiddleware.exists,
                    ],
                    description: desc.updateMatchImages,
                    tag: 'update',
                    fileUpload: true,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/match/musics`,
                parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'operation', type: 'string' }])],
                controller: this.campaignsController.updateMatchMusics,
                schema: DomainDataFaker.mocks.uploadMatchMusics,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.verifyMatchMiddleware.exists,
                    ],
                    description: desc.updateMatchMusics,
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
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    description: desc.updateMatchDate,
                    tag: 'update',
                },
            },

            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/player/character`,
                parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'characterId', type: 'string' }])],
                controller: this.campaignsController.addPlayerCharacter,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    description: desc.addPlayerCharacter,
                    tag: 'management',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/images`,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(1, [{ name: 'imageId', type: 'string' }]),
                    ...generateQueryParam(1, [{ name: 'name', type: 'string' }]),
                    ...generateQueryParam(1, [{ name: 'operation', type: 'string' }]),
                ],
                controller: this.campaignsController.updateCampaignImages,
                schema: DomainDataFaker.mocks.uploadCampaignImages,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.imageMiddleware.multer().single('image'),
                        this.imageMiddleware.fileType,
                        this.verifyMatchMiddleware.exists,
                    ],
                    description: desc.updateCampaignImages,
                    tag: 'update',
                    fileUpload: true,
                },
            },
        ] as routeInstance[];
    }
}

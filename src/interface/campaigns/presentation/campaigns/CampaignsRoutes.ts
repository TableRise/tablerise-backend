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
                parameters: [
                    ...generateQueryParam(2, [
                        { name: 'title', type: 'string', required: 'off' },
                        { name: 'code', type: 'string', required: 'off' },
                    ]),
                ],
                controller: this.campaignsController.getAll,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    schemas: [{ query: this.campaignsSchemas.getAllCampaigns.query }],
                    tag: 'recover',
                    description: desc.getAll,
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/:id/characters`,
                parameters: [...generateIDParam()],
                controller: this.campaignsController.getCampaignCharacters,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    description: desc.getCampaignCharacters,
                    tag: 'recover',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/:id/players`,
                parameters: [...generateIDParam()],
                controller: this.campaignsController.getCampaignPlayers,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    description: desc.getCampaignPlayers,
                    tag: 'recover',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/:id/characters-by-player`,
                parameters: [...generateIDParam()],
                controller: this.campaignsController.getCharactersByPlayer,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    description: desc.getCharactersByPlayer,
                    tag: 'recover',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/:id/journal/posts`,
                parameters: [...generateIDParam()],
                controller: this.campaignsController.getCampaignJournalPosts,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    description: desc.getCampaignJournalPosts,
                    tag: 'recover',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/:id/journal/highlight`,
                parameters: [...generateIDParam()],
                controller: this.campaignsController.getCampaignJournalHighlight,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    description: desc.getCampaignJournalHighlight,
                    tag: 'recover',
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
                        this.imageMiddleware.multer().fields([
                            { name: 'cover', maxCount: 1 },
                            { name: 'mapImages', maxCount: 3 },
                        ]),
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
                path: `${BASE_PATH}/:id/journal/post`,
                parameters: [...generateIDParam()],
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
                path: `${BASE_PATH}/:id/logs`,
                parameters: [...generateIDParam()],
                controller: this.campaignsController.postCampaignLog,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [{ body: this.campaignsSchemas.postCampaignLog.body }],
                    description: desc.postCampaignLog,
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
                path: `${BASE_PATH}/:id/update/player/add`,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(2, [
                        { name: 'password', type: 'string', required: 'off' },
                        { name: 'userToAdd', type: 'string', required: 'off' },
                    ]),
                ],
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
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(1, [{ name: 'userToRemove', type: 'string', required: 'off' }]),
                ],
                controller: this.campaignsController.removeCampaignPlayers,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    description: desc.removeCampaignPlayers,
                    tag: 'management',
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/:id/update/match/player-presence`,
                parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'cancel', type: 'boolean' }])],
                controller: this.campaignsController.confirmPlayerPresence,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    description: desc.confirmPlayerPresence,
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
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [{ body: this.campaignsSchemas.putUpdateCampaign.body }],
                    description: desc.update,
                    tag: 'update',
                },
            },

            // PATCH
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/journal`,
                parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'userId', type: 'string' }])],
                controller: this.campaignsController.updateJournalPost,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [
                        {
                            query: this.campaignsSchemas.patchUpdateCampaignJournalPost.query,
                            body: this.campaignsSchemas.patchUpdateCampaignJournalPost.body,
                        },
                    ],
                    description: desc.updateCampaignJournalPost,
                    tag: 'update',
                },
            },
            {
                method: 'delete',
                path: `${BASE_PATH}/:id/delete/journal`,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(2, [
                        { name: 'userId', type: 'string' },
                        { name: 'postId', type: 'string' },
                    ]),
                ],
                controller: this.campaignsController.deleteJournalPost,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [{ query: this.campaignsSchemas.patchDeleteCampaignJournalPost.query }],
                    description: desc.deleteCampaignJournalPost,
                    tag: 'delete',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/journal/highlight`,
                parameters: [...generateIDParam()],
                controller: this.campaignsController.updateCampaignJournalHighlight,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [{ body: this.campaignsSchemas.patchUpdateCampaignJournalHighlight.body }],
                    description: desc.updateCampaignJournalHighlight,
                    tag: 'update',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/match/map-images/add`,
                parameters: [...generateIDParam()],
                controller: this.campaignsController.addMatchMapImages,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.imageMiddleware.multer().fields([{ name: 'mapImages', maxCount: 3 }]),
                        this.imageMiddleware.fileType,
                        this.verifyIdMiddleware,
                        this.verifyMatchMiddleware.exists,
                    ],
                    schemas: [{ body: this.campaignsSchemas.patchUpdateCampaignMatchMapImages.body }],
                    description: desc.addMatchImages,
                    tag: 'update',
                    fileUpload: true,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/match/map-images/remove`,
                parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'imageUrl', type: 'string' }])],
                controller: this.campaignsController.removeMatchMapImage,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.verifyIdMiddleware,
                        this.verifyMatchMiddleware.exists,
                    ],
                    schemas: [{ query: this.campaignsSchemas.patchRemoveCampaignMatchMapImage.query }],
                    description: desc.removeMatchImage,
                    tag: 'update',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/infos/player-limit`,
                parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'newLimit', type: 'number' }])],
                controller: this.campaignsController.updateCampaignPlayerLimit,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [{ query: this.campaignsSchemas.patchUpdateCampaignPlayerLimit.query }],
                    description: desc.updateCampaignPlayerLimit,
                    tag: 'update',
                    fileUpload: true,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/match/musics/add`,
                parameters: [...generateIDParam()],
                controller: this.campaignsController.addMatchMusic,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.verifyIdMiddleware,
                        this.verifyMatchMiddleware.exists,
                    ],
                    description: desc.addMatchMusic,
                    schemas: [{ body: this.campaignsSchemas.patchAddCampaignMatchMusics.body }],
                    tag: 'update',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/match/musics/remove`,
                parameters: [...generateIDParam()],
                controller: this.campaignsController.removeMatchMusic,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.verifyIdMiddleware,
                        this.verifyMatchMiddleware.exists,
                    ],
                    description: desc.removeMatchMusic,
                    schemas: [{ body: this.campaignsSchemas.patchRemoveCampaignMatchMusic.body }],
                    tag: 'update',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/match/musics/edit`,
                parameters: [...generateIDParam()],
                controller: this.campaignsController.editMatchMusic,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.verifyIdMiddleware,
                        this.verifyMatchMiddleware.exists,
                    ],
                    description: desc.editMatchMusic,
                    schemas: [{ body: this.campaignsSchemas.patchEditCampaignMatchMusic.body }],
                    tag: 'update',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/infos/match-dates/add`,
                parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'date', type: 'string' }])],
                controller: this.campaignsController.addMatchDate,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [{ query: this.campaignsSchemas.patchAddCampaignMatchDate.query }],
                    description: desc.addMatchDate,
                    tag: 'update',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/infos/match-dates/remove`,
                parameters: [...generateIDParam()],
                controller: this.campaignsController.removeMatchDate,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    description: desc.removeMatchDate,
                    tag: 'update',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/player/dungeon-master`,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(1, [{ name: 'userToMaster', type: 'string' }]),
                ],
                controller: this.campaignsController.transferDungeonMaster,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [{ query: this.campaignsSchemas.patchTransferDungeonMaster.query }],
                    description: desc.transferDungeonMaster,
                    tag: 'management',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/player/confirm`,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(1, [{ name: 'userToActivate', type: 'string' }]),
                ],
                controller: this.campaignsController.confirmCampaignPlayer,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [{ query: this.campaignsSchemas.patchConfirmCampaignPlayer.query }],
                    description: desc.confirmCampaignPlayer,
                    tag: 'management',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/player/character/add`,
                parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'characterId', type: 'string' }])],
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
                path: `${BASE_PATH}/:id/update/player/character/remove`,
                parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'characterId', type: 'string' }])],
                controller: this.campaignsController.removePlayerCharacter,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    description: desc.removePlayerCharacter,
                    schemas: [{ query: this.campaignsSchemas.patchRemoveCampaignPlayerCharacter.query }],
                    tag: 'management',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/cover/remove`,
                parameters: [...generateIDParam()],
                controller: this.campaignsController.removeCampaignCover,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    description: desc.removeCampaignCover,
                    tag: 'update',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/cover`,
                parameters: [...generateIDParam()],
                controller: this.campaignsController.updateCampaignCover,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.imageMiddleware.multer().single('picture'),
                        this.imageMiddleware.fileType,
                        this.verifyIdMiddleware,
                    ],
                    schemas: [{ body: this.campaignsSchemas.patchUpdateCampaignCover.body }],
                    description: desc.updateCampaignCover,
                    tag: 'update',
                    fileUpload: true,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/match/character/picture`,
                parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'characterId', type: 'string' }])],
                controller: this.campaignsController.updateMatchCharacterPicture,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.imageMiddleware.multer().single('picture'),
                        this.imageMiddleware.fileType,
                        this.verifyIdMiddleware,
                        this.verifyMatchMiddleware.exists,
                    ],
                    schemas: [{ body: this.campaignsSchemas.patchUpdateMatchCharacterPicture.body }],
                    description: desc.updateMatchCharacterPicture,
                    tag: 'update',
                    fileUpload: true,
                },
            },

            // DELETE
            {
                method: 'delete',
                path: `${BASE_PATH}/:id/delete`,
                parameters: [...generateIDParam()],
                controller: this.campaignsController.deleteCampaign,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    description: desc.deleteCampaign,
                    tag: 'delete',
                },
            },
        ] as routeInstance[];
    }
}

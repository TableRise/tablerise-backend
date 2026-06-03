import 'src/interface/common/strategies/CookieStrategy';

import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import desc from 'src/interface/campaigns/presentation/campaigns/RoutesDescription';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

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
            { basePath: BASE_PATH },
            // GET
            {
                method: 'get',
                path: '/:id',
                controller: this.campaignsController.getById,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    description: desc.getById,
                    tag: 'recover',
                },
            },
            {
                method: 'get',
                path: '/',
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
                path: '/:id/characters',
                controller: this.campaignsController.getCampaignCharacters,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    description: desc.getCampaignCharacters,
                    tag: 'recover',
                },
            },
            {
                method: 'get',
                path: '/:id/players',
                controller: this.campaignsController.getCampaignPlayers,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    description: desc.getCampaignPlayers,
                    tag: 'recover',
                },
            },
            {
                method: 'get',
                path: '/:id/characters-by-player',
                controller: this.campaignsController.getCharactersByPlayer,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    description: desc.getCharactersByPlayer,
                    tag: 'recover',
                },
            },
            {
                method: 'get',
                path: '/:id/journal/posts',
                controller: this.campaignsController.getCampaignJournalPosts,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    description: desc.getCampaignJournalPosts,
                    tag: 'recover',
                },
            },
            {
                method: 'get',
                path: '/:id/journal/highlight',
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
                path: '/create',
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
                path: '/:id/journal/post',
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
                path: '/:id/buys',
                controller: this.campaignsController.postCampaignBuy,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [{ body: this.campaignsSchemas.postCampaignBuy.body }],
                    description: desc.postCampaignBuy,
                    tag: 'create',
                },
            },
            {
                method: 'post',
                path: '/:id/update/player/add',
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
                path: '/:id/update/player/remove',
                controller: this.campaignsController.removeCampaignPlayers,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [{ query: this.campaignsSchemas.postRemoveCampaignPlayers.query }],
                    description: desc.removeCampaignPlayers,
                    tag: 'management',
                },
            },
            {
                method: 'post',
                path: '/:id/update/match/player-presence',
                controller: this.campaignsController.confirmPlayerPresence,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [{ query: this.campaignsSchemas.postConfirmPlayerPresence.query }],
                    description: desc.confirmPlayerPresence,
                    tag: 'management',
                },
            },

            // PUT
            {
                method: 'put',
                path: '/:id/update',
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
                path: '/:id/update/journal',
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
                method: 'patch',
                path: '/:id/update/notes',
                controller: this.campaignsController.updatePlayerNote,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [
                        {
                            query: this.campaignsSchemas.patchUpdateCampaignPlayerNote.query,
                            body: this.campaignsSchemas.patchUpdateCampaignPlayerNote.body,
                        },
                    ],
                    description: desc.updateCampaignPlayerNote,
                    tag: 'update',
                },
            },
            {
                method: 'patch',
                path: '/:id/update/notes/remove',
                controller: this.campaignsController.removePlayerNote,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [{ query: this.campaignsSchemas.patchRemoveCampaignPlayerNote.query }],
                    description: desc.removeCampaignPlayerNote,
                    tag: 'update',
                },
            },
            {
                method: 'delete',
                path: '/:id/delete/journal',
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
                path: '/:id/update/journal/highlight',
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
                path: '/:id/update/match/map-images/add',
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
                path: '/:id/update/match/images',
                controller: this.campaignsController.addMatchImages,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.imageMiddleware.multer().fields([{ name: 'images' }]),
                        this.imageMiddleware.fileType,
                        this.verifyIdMiddleware,
                        this.verifyMatchMiddleware.exists,
                    ],
                    schemas: [{ body: this.campaignsSchemas.patchUpdateCampaignMatchImages.body }],
                    description: desc.addMatchGalleryImages,
                    tag: 'update',
                    fileUpload: true,
                },
            },
            {
                method: 'patch',
                path: '/:id/update/match/images/highlight',
                controller: this.campaignsController.highlightMatchImage,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.verifyIdMiddleware,
                        this.verifyMatchMiddleware.exists,
                    ],
                    schemas: [{ query: this.campaignsSchemas.patchHighlightCampaignMatchImage.query }],
                    description: desc.highlightMatchImage,
                    tag: 'update',
                },
            },
            {
                method: 'patch',
                path: '/:id/update/match/map-images/remove',
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
                path: '/:id/update/match/musics/add',
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
                path: '/:id/update/match/musics/remove',
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
                path: '/:id/update/match/musics/edit',
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
                path: '/:id/update/player/dungeon-master',
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
                path: '/:id/update/player/confirm',
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
                path: '/:id/update/player/character/add',
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
                path: '/:id/update/player/character/remove',
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
                path: '/:id/update/cover/remove',
                controller: this.campaignsController.removeCampaignCover,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    description: desc.removeCampaignCover,
                    tag: 'update',
                },
            },
            {
                method: 'patch',
                path: '/:id/update/cover',
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
            // DELETE
            {
                method: 'patch',
                path: '/:id/close',
                controller: this.campaignsController.deleteCampaign,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    description: desc.deleteCampaign,
                    tag: 'update',
                },
            },
        ] as unknown as routeInstance[];
    }
}

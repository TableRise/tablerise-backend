import sinon from 'sinon';
import CampaignDomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import CharacterDomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import ConfirmCampaignPlayerOperation from 'src/core/campaigns/operations/ConfirmCampaignPlayerOperation';
import ConfirmMatchPlayerPresenceOperation from 'src/core/campaigns/operations/ConfirmMatchPlayerPresenceOperation';
import GetCampaignCharactersOperation from 'src/core/campaigns/operations/GetCampaignCharactersOperation';
import GetCharactersByPlayerOperation from 'src/core/campaigns/operations/GetCharactersByPlayerOperation';
import RemoveCampaignImageOperation from 'src/core/campaigns/operations/RemoveCampaignImageOperation';
import RemovePlayerCharacterOperation from 'src/core/campaigns/operations/RemovePlayerCharacterOperation';
import TransferDungeonMasterOperation from 'src/core/campaigns/operations/TransferDungeonMasterOperation';
import UpdateCampaignCoverOperation from 'src/core/campaigns/operations/UpdateCampaignCoverOperation';
import UpdateMatchCharacterPictureOperation from 'src/core/campaigns/operations/UpdateMatchCharacterPictureOperation';
import updateMatchDateOperation from 'src/core/campaigns/operations/UpdateMatchDateOperation';
import UpdateMatchMusicsOperation from 'src/core/campaigns/operations/UpdateMatchMusicsOperation';
import ConfirmMatchPlayerPresenceService from 'src/core/campaigns/services/ConfirmMatchPlayerPresenceService';
import GetCampaignCharactersService from 'src/core/campaigns/services/GetCampaignCharactersService';
import GetCharactersByPlayerService from 'src/core/campaigns/services/GetCharactersByPlayerService';
import RemoveCampaignImageService from 'src/core/campaigns/services/RemoveCampaignImageService';
import RemovePlayerCharacterService from 'src/core/campaigns/services/RemovePlayerCharacterService';
import TransferDungeonMasterService from 'src/core/campaigns/services/TransferDungeonMasterService';
import UpdateCampaignCoverService from 'src/core/campaigns/services/UpdateCampaignCoverService';
import UpdateMatchCharacterPictureService from 'src/core/campaigns/services/UpdateMatchCharacterPictureService';

describe('Coverage :: Campaigns :: Core Expansion', () => {
    const logger = (): void => {};

    describe('operations', () => {
        it('should cover confirmation, retrieval, and character operations', async () => {
            const savedCampaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
            savedCampaign.campaignPlayers = [
                { userId: 'dm', role: 'dungeon_master', status: 'active', characterIds: [] },
                { userId: 'target', role: 'player', status: 'active', characterIds: ['char-1'] },
            ] as any;

            const confirmedCampaign = { ...savedCampaign };
            const confirmCampaignPlayerService = { confirm: sinon.stub().resolves(confirmedCampaign) };
            const socketIO = {
                syncActiveCampaign: sinon.stub(),
                emitToCampaign: sinon.stub(),
            };
            const confirmCampaignPlayerOperation = new ConfirmCampaignPlayerOperation({
                logger,
                confirmCampaignPlayerService,
                socketIO,
            } as any);

            await confirmCampaignPlayerOperation.execute(savedCampaign.campaignId, 'dm', 'target');

            expect(confirmCampaignPlayerService.confirm).to.have.been.calledWith(savedCampaign.campaignId, 'dm', 'target');
            expect(socketIO.syncActiveCampaign).to.have.been.calledWith(confirmedCampaign);
            expect(socketIO.emitToCampaign).to.have.been.calledWith(
                savedCampaign.campaignId,
                'campaign:player_joined',
                sinon.match.has('player', confirmedCampaign.campaignPlayers[1])
            );

            const confirmMatchPlayerPresenceService = { confirmPresence: sinon.stub().resolves() };
            const confirmMatchPlayerPresenceOperation = new ConfirmMatchPlayerPresenceOperation({
                logger,
                confirmMatchPlayerPresenceService,
            } as any);

            await confirmMatchPlayerPresenceOperation.execute(savedCampaign.campaignId, 'target', true);
            expect(confirmMatchPlayerPresenceService.confirmPresence).to.have.been.calledWith(
                savedCampaign.campaignId,
                'target',
                true
            );

            const characters = CharacterDomainDataFaker.generateCharactersJSON().slice(0, 2);
            const getCampaignCharactersService = { get: sinon.stub().resolves(characters) };
            const getCampaignCharactersOperation = new GetCampaignCharactersOperation({
                getCampaignCharactersService,
                logger,
            } as any);
            expect(await getCampaignCharactersOperation.execute(savedCampaign.campaignId)).to.deep.equal(characters);

            const recoveredCharacters = [{ characterId: 'char-1' }];
            const getCharactersByPlayerService = { get: sinon.stub().resolves(recoveredCharacters) };
            const getCharactersByPlayerOperation = new GetCharactersByPlayerOperation({
                getCharactersByPlayerService,
                logger,
            } as any);

            expect(await getCharactersByPlayerOperation.execute(savedCampaign.campaignId, 'target')).to.deep.equal(
                recoveredCharacters
            );
            expect(getCharactersByPlayerService.get).to.have.been.calledWith(savedCampaign.campaignId, 'target');

            const campaignAfterCharacterRemoval = { ...savedCampaign };
            const removePlayerCharacterService = {
                removeCharacter: sinon.stub().resolves(campaignAfterCharacterRemoval),
                save: sinon.stub().resolves(campaignAfterCharacterRemoval),
            };
            const removePlayerCharacterOperation = new RemovePlayerCharacterOperation({
                removePlayerCharacterService,
                logger,
            } as any);
            expect(
                await removePlayerCharacterOperation.execute({
                    campaignId: savedCampaign.campaignId,
                    characterId: 'char-1',
                } as any)
            ).to.equal(campaignAfterCharacterRemoval);
            expect(removePlayerCharacterService.save).to.have.been.calledWith(campaignAfterCharacterRemoval);
        });

        it('should cover image, dungeon master, cover and picture update operations', async () => {
            const savedCampaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
            savedCampaign.matchData = { ...(savedCampaign.matchData ?? {}), mapImages: [{ id: 'map-1', link: 'map-link' }] } as any;
            savedCampaign.cover = { id: 'cover-1', link: 'cover-link' } as any;

            const socketIO = {
                syncActiveCampaign: sinon.stub(),
                emitToCampaign: sinon.stub(),
            };

            const removeCampaignImageService = {
                removeCover: sinon.stub().resolves(savedCampaign),
                removeMatchMapImage: sinon.stub().resolves(savedCampaign),
                save: sinon.stub().resolves(savedCampaign),
            };
            const removeCampaignImageOperation = new RemoveCampaignImageOperation({
                removeCampaignImageService,
                socketIO,
                logger,
            } as any);

            await removeCampaignImageOperation.removeCover(savedCampaign.campaignId);
            await removeCampaignImageOperation.removeMatchMapImage({
                campaignId: savedCampaign.campaignId,
                imageUrl: 'map-link',
            } as any);

            expect(removeCampaignImageService.removeCover).to.have.been.calledWith({ campaignId: savedCampaign.campaignId });
            expect(removeCampaignImageService.removeMatchMapImage).to.have.been.calledWith({
                campaignId: savedCampaign.campaignId,
                imageUrl: 'map-link',
            });
            expect(socketIO.emitToCampaign).to.have.been.calledWith(
                savedCampaign.campaignId,
                'campaign:maps_updated',
                sinon.match.has('mapImages', savedCampaign.matchData.mapImages)
            );

            const transferDungeonMasterService = { transfer: sinon.stub().resolves(savedCampaign) };
            const transferDungeonMasterOperation = new TransferDungeonMasterOperation({
                logger,
                transferDungeonMasterService,
                socketIO,
            } as any);

            await transferDungeonMasterOperation.execute(savedCampaign.campaignId, 'old-dm', 'new-dm');
            expect(socketIO.emitToCampaign).to.have.been.calledWith(
                savedCampaign.campaignId,
                'campaign:dungeon_master_transferred',
                {
                    campaignId: savedCampaign.campaignId,
                    previousDungeonMasterId: 'old-dm',
                    newDungeonMasterId: 'new-dm',
                }
            );

            const coverCampaign = { ...savedCampaign, cover: { id: 'new-cover' } };
            const updateCampaignCoverService = {
                updateCover: sinon.stub().resolves(coverCampaign),
                save: sinon.stub().resolves(coverCampaign),
            };
            const updateCampaignCoverOperation = new UpdateCampaignCoverOperation({
                updateCampaignCoverService,
                logger,
            } as any);

            expect(
                await updateCampaignCoverOperation.execute({
                    campaignId: savedCampaign.campaignId,
                    picture: { originalname: 'cover.png' } as any,
                })
            ).to.equal(coverCampaign.cover);

            const uploaded = { id: 'pic-1', link: 'img-link' };
            const updateMatchCharacterPictureService = {
                updatePicture: sinon.stub().resolves({ campaign: savedCampaign, uploaded }),
                save: sinon.stub().resolves(savedCampaign),
            };
            const updateMatchCharacterPictureOperation = new UpdateMatchCharacterPictureOperation({
                updateMatchCharacterPictureService,
                logger,
            } as any);

            expect(
                await updateMatchCharacterPictureOperation.execute({
                    campaignId: savedCampaign.campaignId,
                    characterId: 'char-1',
                    picture: { originalname: 'char.png' } as any,
                })
            ).to.equal(uploaded);
            expect(updateMatchCharacterPictureService.save).to.have.been.calledWith(savedCampaign);
        });

        it('should cover remove branches for match date and music operations', async () => {
            const savedCampaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
            savedCampaign.infos.nextMatchDate = '2026-05-25';
            savedCampaign.musics = [{ id: 'music-1', title: 'Song', thumbnail: 'thumb' }] as any;

            const socketIO = {
                syncActiveCampaign: sinon.stub(),
                emitToCampaign: sinon.stub(),
            };

            const updateMatchDateService = {
                addMatchDate: sinon.stub().resolves(savedCampaign),
                removeMatchDate: sinon.stub().resolves(savedCampaign),
                save: sinon.stub().resolves(savedCampaign),
            };
            const matchDateOperation = new updateMatchDateOperation({
                updateMatchDateService,
                socketIO,
                logger,
            } as any);

            expect(await matchDateOperation.remove({ campaignId: savedCampaign.campaignId } as any)).to.equal(
                '2026-05-25'
            );
            expect(socketIO.emitToCampaign).to.have.been.calledWith(
                savedCampaign.campaignId,
                'campaign:settings_updated',
                {
                    campaignId: savedCampaign.campaignId,
                    nextMatchDate: '2026-05-25',
                }
            );

            const updateMatchMusicsService = {
                addMatchMusic: sinon.stub().resolves(savedCampaign),
                removeMatchMusic: sinon.stub().resolves(savedCampaign),
                editMatchMusic: sinon.stub().resolves(savedCampaign),
                save: sinon.stub().resolves(savedCampaign),
            };
            const updateMusicsOperation = new UpdateMatchMusicsOperation({
                updateMatchMusicsService,
                socketIO,
                logger,
            } as any);

            expect(
                await updateMusicsOperation.remove({
                    campaignId: savedCampaign.campaignId,
                    id: 'music-1',
                } as any)
            ).to.equal(savedCampaign.musics);
            expect(
                await updateMusicsOperation.edit({
                    campaignId: savedCampaign.campaignId,
                    id: 'music-1',
                    title: 'Edited',
                    thumbnail: 'new-thumb',
                } as any)
            ).to.equal(savedCampaign.musics);
            expect(socketIO.emitToCampaign).to.have.been.calledWith(
                savedCampaign.campaignId,
                'campaign:musics_updated',
                {
                    campaignId: savedCampaign.campaignId,
                    musics: savedCampaign.musics,
                }
            );
        });
    });

    describe('services', () => {
        it('should cover presence confirmation service branches', async () => {
            const campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
            const player = { userId: 'player-1', role: 'player', status: 'active', characterIds: [] };
            campaign.campaignPlayers = [player] as any;
            campaign.matchData = { ...(campaign.matchData ?? {}), confirmedPlayers: [] } as any;

            const campaignsRepository = {
                findOne: sinon.stub().resolves(campaign),
                update: sinon.stub().callsFake(async ({ payload }) => payload),
            };
            const socketIO = {
                syncActiveCampaign: sinon.stub(),
                emitToCampaign: sinon.stub(),
            };

            const service = new ConfirmMatchPlayerPresenceService({
                logger,
                campaignsRepository,
                socketIO,
            } as any);

            await service.confirmPresence(campaign.campaignId, player.userId, false);
            expect(campaign.matchData.confirmedPlayers).to.have.length(1);

            await service.confirmPresence(campaign.campaignId, player.userId, true);
            expect(campaign.matchData.confirmedPlayers).to.deep.equal([]);
            expect(socketIO.emitToCampaign).to.have.been.calledWith(
                campaign.campaignId,
                'presence:confirmed_players_updated',
                sinon.match.has('campaignId', campaign.campaignId)
            );
        });

        it('should cover campaign and player character retrieval services', async () => {
            const character = CharacterDomainDataFaker.generateCharactersJSON()[0];
            const charactersRepository = {
                find: sinon.stub().resolves([character]),
                findOne: sinon.stub().resolves(character),
            };

            const getCampaignCharactersService = new GetCampaignCharactersService({
                charactersRepository,
                logger,
            } as any);

            expect(await getCampaignCharactersService.get('campaign-1')).to.deep.equal([character]);
            expect(charactersRepository.find).to.have.been.calledWith({ campaignId: 'campaign-1' });

            const campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
            campaign.campaignPlayers = [
                {
                    userId: 'player-1',
                    role: 'player',
                    status: 'active',
                    characterIds: [character.characterId],
                },
            ] as any;

            const campaignsRepository = { findOne: sinon.stub().resolves(campaign) };
            const getCharactersByPlayerService = new GetCharactersByPlayerService({
                campaignsRepository,
                charactersRepository,
                logger,
            } as any);

            const result = await getCharactersByPlayerService.get(campaign.campaignId, 'player-1');
            expect(result[0]).to.include({
                characterId: character.characterId,
            });

            try {
                await getCharactersByPlayerService.get(campaign.campaignId, 'missing-player');
                expect.fail('expected missing player error');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).to.equal('This player is not in the campaign');
                expect(err.code).to.equal(HttpStatusCode.NOT_FOUND);
                expect(err.name).to.equal(getErrorName(HttpStatusCode.NOT_FOUND));
            }
        });

        it('should cover image removal service branches', async () => {
            const campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
            campaign.cover = { id: 'cover-1', link: 'cover-link' } as any;
            campaign.matchData = {
                ...(campaign.matchData ?? {}),
                mapImages: [
                    { id: 'map-1', link: 'first-link' },
                    { id: 'map-2', link: 'second-link' },
                ],
                state: {
                    activeMapId: 'map-1',
                },
            } as any;

            const campaignsRepository = {
                findOne: sinon.stub().resolves(campaign),
                update: sinon.stub().callsFake(async ({ payload }) => payload),
            };
            const service = new RemoveCampaignImageService({ campaignsRepository, logger } as any);

            const coverlessCampaign = await service.removeCover({ campaignId: campaign.campaignId });
            expect((coverlessCampaign as any).cover).to.equal(null);

            const updatedCampaign = await service.removeMatchMapImage({
                campaignId: campaign.campaignId,
                imageUrl: 'first-link',
            });
            expect(updatedCampaign.matchData.mapImages).to.have.length(1);
            expect((updatedCampaign.matchData as any).state.activeMapId).to.equal(null);

            expect(await service.save(updatedCampaign)).to.equal(updatedCampaign);
        });

        it('should cover player character removal, transfer, and cover upload services', async () => {
            const campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
            campaign.campaignPlayers = [
                {
                    userId: 'dm',
                    role: 'dungeon_master',
                    status: 'active',
                    characterIds: [],
                },
                {
                    userId: 'player-1',
                    role: 'player',
                    status: 'active',
                    characterIds: ['char-1'],
                },
            ] as any;

            const campaignsRepository = {
                findOne: sinon.stub().resolves(campaign),
                update: sinon.stub().callsFake(async ({ payload }) => payload),
            };
            const charactersRepository = {
                update: sinon.stub().resolves({}),
            };

            const removePlayerCharacterService = new RemovePlayerCharacterService({
                campaignsRepository,
                charactersRepository,
                logger,
            } as any);

            const campaignWithoutCharacter = await removePlayerCharacterService.removeCharacter({
                campaignId: campaign.campaignId,
                characterId: 'char-1',
            } as any);
            expect(campaignWithoutCharacter.campaignPlayers[1].characterIds).to.deep.equal([]);
            expect(charactersRepository.update).to.have.been.calledWith({
                query: { characterId: 'char-1' },
                payload: { campaignId: null },
            });
            expect(await removePlayerCharacterService.save(campaignWithoutCharacter)).to.equal(campaignWithoutCharacter);

            const transferService = new TransferDungeonMasterService({
                logger,
                campaignsRepository,
            } as any);
            const transferred = await transferService.transfer(campaign.campaignId, 'dm', 'player-1');
            expect(transferred.campaignPlayers[0].role).to.equal('player');
            expect(transferred.campaignPlayers[1].role).to.equal('dungeon_master');

            try {
                await transferService.transfer(campaign.campaignId, 'player-1', 'missing');
                expect.fail('expected missing target error');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).to.equal('This player is not in the campaign');
                expect(err.code).to.equal(HttpStatusCode.NOT_FOUND);
                expect(err.name).to.equal(getErrorName(HttpStatusCode.NOT_FOUND));
            }
        });

        it('should cover forbidden transfer and match character picture service branches', async () => {
            const campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
            campaign.campaignPlayers = [
                {
                    userId: 'player-1',
                    role: 'player',
                    status: 'active',
                    characterIds: [],
                },
            ] as any;
            campaign.matchData = {
                ...(campaign.matchData ?? {}),
                charactersInGame: [{ characterId: 'char-1', picture: null }],
            } as any;

            const campaignsRepository = {
                findOne: sinon.stub().resolves(campaign),
                update: sinon.stub().callsFake(async ({ payload }) => payload),
            };
            const imageStorageClient = {
                upload: sinon.stub().resolves({ id: 'img-1', link: 'img-link' }),
            };

            const transferService = new TransferDungeonMasterService({
                logger,
                campaignsRepository,
            } as any);

            try {
                await transferService.transfer(campaign.campaignId, 'player-1', 'char-1');
                expect.fail('expected forbidden role error');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).to.equal('The operation is forbidden for this role');
                expect(err.code).to.equal(HttpStatusCode.BAD_REQUEST);
                expect(err.name).to.equal(getErrorName(HttpStatusCode.BAD_REQUEST));
            }

            const updateCampaignCoverService = new UpdateCampaignCoverService({
                campaignsRepository,
                imageStorageClient,
                logger,
            } as any);
            const campaignWithCover = await updateCampaignCoverService.updateCover({
                campaignId: campaign.campaignId,
                picture: { originalname: 'cover.png' } as any,
            });
            expect(campaignWithCover.cover).to.deep.equal({ id: 'img-1', link: 'img-link' });
            expect(await updateCampaignCoverService.save(campaignWithCover)).to.equal(campaignWithCover);

            const matchCharacterPictureService = new UpdateMatchCharacterPictureService({
                campaignsRepository,
                imageStorageClient,
                logger,
            } as any);
            const pictureResult = await matchCharacterPictureService.updatePicture({
                campaignId: campaign.campaignId,
                characterId: 'char-1',
                picture: { originalname: 'char.png' } as any,
            });
            expect(pictureResult.uploaded).to.deep.equal({ id: 'img-1', link: 'img-link' });
            expect(await matchCharacterPictureService.save(campaign)).to.equal(campaign);

            try {
                await matchCharacterPictureService.updatePicture({
                    campaignId: campaign.campaignId,
                    characterId: 'missing-char',
                    picture: { originalname: 'char.png' } as any,
                });
                expect.fail('expected missing player error');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).to.equal('This player is not in the campaign');
                expect(err.code).to.equal(HttpStatusCode.NOT_FOUND);
                expect(err.name).to.equal(getErrorName(HttpStatusCode.NOT_FOUND));
            }

            campaign.matchData = null as any;

            try {
                await matchCharacterPictureService.updatePicture({
                    campaignId: campaign.campaignId,
                    characterId: 'char-1',
                    picture: { originalname: 'char.png' } as any,
                });
                expect.fail('expected match missing error');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).to.equal('Campaign Match does not exist and cannot be updated');
                expect(err.code).to.equal(HttpStatusCode.BAD_REQUEST);
                expect(err.name).to.equal(getErrorName(HttpStatusCode.BAD_REQUEST));
            }
        });
    });
});

import sinon from 'sinon';
import UpdateMatchMusicsService from 'src/core/campaigns/services/UpdateMatchMusicsService';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Camapaigns :: Services :: UpdateMatchMusicsService', () => {
    let updateMatchMusicsService: UpdateMatchMusicsService,
        campaignsRepository: any,
        updateMusicsPayload: any,
        campaignMusicsLength: number,
        campaign: Campaign;

    const logger = (): void => {};

    context('#addMatchMusic', () => {
        context('When a music is added to match data', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];
                campaign.musics = campaign.musics ?? campaign.matchData?.musics ?? [];

                campaignMusicsLength = campaign.musics.length ?? 0;

                campaignsRepository = {
                    findOne: () => ({ ...campaign }),
                };

                updateMusicsPayload = {
                    campaignId: campaign.campaignId,
                    id: 'https://youtu.be/12345',
                    thumbnail: '',
                    title: 'Main Theme 2',
                };

                updateMatchMusicsService = new UpdateMatchMusicsService({
                    logger,
                    campaignsRepository,
                });
            });

            it('should return the updated campaign', async () => {
                const matchDataUpdated = await updateMatchMusicsService.addMatchMusic(updateMusicsPayload);
                expect(matchDataUpdated.musics.length).to.be.not.equal(campaignMusicsLength);
                expect(matchDataUpdated.musics.length).to.be.equal(campaignMusicsLength + 1);
            });
        });

        context('When a music is added to match data - music already exists', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];
                campaign.musics = campaign.musics ?? campaign.matchData?.musics ?? [];

                if (campaign.matchData)
                    campaign.musics = [
                        {
                            title: 'Main Theme 2',
                            id: 'https://youtu.be/12345',
                            thumbnail: '',
                        },
                    ];

                campaignsRepository = {
                    findOne: () => ({ ...campaign }),
                };

                updateMusicsPayload = {
                    campaignId: campaign.campaignId,
                    id: 'https://youtu.be/12345',
                    thumbnail: '',
                    title: 'Main Theme 2',
                };

                updateMatchMusicsService = new UpdateMatchMusicsService({
                    logger,
                    campaignsRepository,
                });
            });

            it('should throw an error', async () => {
                try {
                    await updateMatchMusicsService.addMatchMusic(updateMusicsPayload);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Music link already added');
                    expect(err.code).to.be.equal(HttpStatusCode.UNPROCESSABLE_ENTITY);
                    expect(err.name).to.be.equal(getErrorName(HttpStatusCode.UNPROCESSABLE_ENTITY));
                }
            });
        });

        it('should initialize an empty musics list when the campaign has none', async () => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];
            campaign.musics = undefined as any;

            campaignsRepository = {
                findOne: () => campaign,
            };

            updateMatchMusicsService = new UpdateMatchMusicsService({
                logger,
                campaignsRepository,
            });

            const updated = await updateMatchMusicsService.addMatchMusic({
                campaignId: campaign.campaignId,
                id: 'music-id',
                title: 'Song',
                thumbnail: 'thumb',
            });

            expect(updated.musics).to.have.lengthOf(1);
        });
    });

    context('#removeMatchMusic', () => {
        context('When a music is removed from match data', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];
                campaign.musics = campaign.musics ?? campaign.matchData?.musics ?? [];

                if (campaign.matchData)
                    campaign.musics = [
                        {
                            title: 'Main Theme 2',
                            id: 'https://youtu.be/123',
                            thumbnail: '',
                        },
                    ];

                campaignMusicsLength = campaign.musics.length ?? 0;

                campaignsRepository = {
                    findOne: () => campaign,
                };

                updateMusicsPayload = {
                    campaignId: campaign.campaignId,
                    id: 'https://youtu.be/123',
                };

                updateMatchMusicsService = new UpdateMatchMusicsService({
                    logger,
                    campaignsRepository,
                });
            });

            it('should return the updated campaign', async () => {
                const matchDataUpdated = await updateMatchMusicsService.removeMatchMusic(updateMusicsPayload);
                expect(matchDataUpdated.musics.length).to.be.not.equal(campaignMusicsLength);
                expect(matchDataUpdated.musics.length).to.be.equal(campaignMusicsLength - 1);
            });
        });

        it('should clear the playing music when the removed track is active', async () => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];
            campaign.musics = [
                {
                    title: 'Main Theme 2',
                    id: 'https://youtu.be/active',
                    thumbnail: '',
                },
            ] as any;
            (campaign.matchData as any).state = (campaign.matchData as any).state ?? {};
            (campaign.matchData as any).state.playingMusicId = 'https://youtu.be/active';

            campaignsRepository = {
                findOne: () => campaign,
            };

            updateMatchMusicsService = new UpdateMatchMusicsService({
                logger,
                campaignsRepository,
            });

            const updatedCampaign = await updateMatchMusicsService.removeMatchMusic({
                campaignId: campaign.campaignId,
                id: 'https://youtu.be/active',
            });

            expect((updatedCampaign.matchData as any).state.playingMusicId).to.equal(null);
        });

        it('should keep playingMusicId untouched when another music is removed', async () => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];
            campaign.musics = [
                {
                    title: 'Main Theme 2',
                    id: 'https://youtu.be/active',
                    thumbnail: '',
                },
            ] as any;
            (campaign.matchData as any).state = { playingMusicId: 'keep-me' };

            campaignsRepository = {
                findOne: () => campaign,
            };

            updateMatchMusicsService = new UpdateMatchMusicsService({
                logger,
                campaignsRepository,
            });

            const updatedCampaign = await updateMatchMusicsService.removeMatchMusic({
                campaignId: campaign.campaignId,
                id: 'https://youtu.be/active',
            });

            expect((updatedCampaign.matchData as any).state.playingMusicId).to.equal('keep-me');
        });

        it('should initialize an empty musics list when removing from a campaign without musics', async () => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];
            campaign.musics = undefined as any;

            campaignsRepository = {
                findOne: () => campaign,
            };

            updateMatchMusicsService = new UpdateMatchMusicsService({
                logger,
                campaignsRepository,
            });

            const updatedCampaign = await updateMatchMusicsService.removeMatchMusic({
                campaignId: campaign.campaignId,
                id: 'missing',
            });

            expect(updatedCampaign.musics).to.deep.equal([]);
        });

        it('should keep playingMusicId untouched when matchData is missing', async () => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];
            campaign.musics = [] as any;
            campaign.matchData = null as any;

            campaignsRepository = {
                findOne: () => campaign,
            };

            updateMatchMusicsService = new UpdateMatchMusicsService({
                logger,
                campaignsRepository,
            });

            const updatedCampaign = await updateMatchMusicsService.removeMatchMusic({
                campaignId: campaign.campaignId,
                id: 'missing',
            });

            expect(updatedCampaign.matchData).to.equal(null);
        });
    });

    context('#editMatchMusic', () => {
        it('should update the matching music title and thumbnail', async () => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];
            campaign.musics = [
                {
                    title: 'Old',
                    id: 'music-id',
                    thumbnail: 'old-thumb',
                },
            ] as any;

            campaignsRepository = {
                findOne: () => campaign,
            };

            updateMatchMusicsService = new UpdateMatchMusicsService({
                logger,
                campaignsRepository,
            });

            const updatedCampaign = await updateMatchMusicsService.editMatchMusic({
                campaignId: campaign.campaignId,
                id: 'music-id',
                title: 'New',
                thumbnail: 'new-thumb',
            });

            expect(updatedCampaign.musics[0]).to.deep.equal({
                title: 'New',
                id: 'music-id',
                thumbnail: 'new-thumb',
            });
        });

        it('should initialize musics when editing a campaign with no list', async () => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];
            campaign.musics = undefined as any;

            campaignsRepository = {
                findOne: () => campaign,
            };

            updateMatchMusicsService = new UpdateMatchMusicsService({
                logger,
                campaignsRepository,
            });

            const updatedCampaign = await updateMatchMusicsService.editMatchMusic({
                campaignId: campaign.campaignId,
                id: 'music-id',
                title: 'New',
                thumbnail: 'new-thumb',
            });

            expect(updatedCampaign.musics).to.deep.equal([]);
        });

        it('should preserve existing musics when the target id is not found', async () => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];
            campaign.musics = [
                {
                    title: 'Existing',
                    id: 'existing-id',
                    thumbnail: 'thumb',
                },
            ] as any;

            campaignsRepository = {
                findOne: () => campaign,
            };

            updateMatchMusicsService = new UpdateMatchMusicsService({
                logger,
                campaignsRepository,
            });

            const updatedCampaign = await updateMatchMusicsService.editMatchMusic({
                campaignId: campaign.campaignId,
                id: 'missing-id',
                title: 'New',
                thumbnail: 'new-thumb',
            });

            expect(updatedCampaign.musics).to.deep.equal([
                {
                    title: 'Existing',
                    id: 'existing-id',
                    thumbnail: 'thumb',
                },
            ]);
        });
    });

    context('#save', () => {
        context('When a campaign with new music is saved', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];
                campaign.musics = campaign.musics ?? campaign.matchData?.musics ?? [];

                if (campaign.matchData)
                    campaign.musics = [
                        {
                            title: 'Main Theme',
                            id: 'https://youtu.be/123',
                            thumbnail: '',
                        },
                    ];

                campaignsRepository = {
                    update: sinon.spy(() => campaign),
                };

                updateMatchMusicsService = new UpdateMatchMusicsService({
                    campaignsRepository,
                    logger,
                });
            });

            it('should call correct methods', async () => {
                const saveCamapaignTest = await updateMatchMusicsService.save(campaign);

                expect(saveCamapaignTest).to.be.deep.equal(campaign);
                expect(campaignsRepository.update).to.have.been.calledWith({
                    query: { campaignId: campaign.campaignId },
                    payload: campaign,
                });
            });
        });
    });
});

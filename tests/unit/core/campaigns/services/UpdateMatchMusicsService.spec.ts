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

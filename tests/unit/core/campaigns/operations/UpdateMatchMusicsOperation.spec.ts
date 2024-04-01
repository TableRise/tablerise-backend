import sinon from 'sinon';
import UpdateMatchMusicsOperation from 'src/core/campaigns/operations/campaigns/UpdateMatchMusicsOperation';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Operations :: UpdateMatchMusicsOperation', () => {
    let updateMatchMusicsOperation: UpdateMatchMusicsOperation,
        updateMatchMusicsService: any,
        matchMusicsPayload: any,
        campaign: CampaignInstance;

    const logger = (): void => {};

    context('#execute', () => {
        context('When a campaign has the match musics', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                matchMusicsPayload = {
                    campaignId: campaign.campaignId,
                    youtubeLink: 'https://youtu.be/123',
                    title: 'Main Theme 2',
                    operation: 'add',
                };

                campaign.matchData.musics = [
                    {
                        title: matchMusicsPayload.title,
                        youtubeLink: matchMusicsPayload.youtubeLink,
                    },
                ];

                updateMatchMusicsService = {
                    updateMatchMusics: sinon.spy(),
                    save: sinon.spy(() => campaign),
                };

                updateMatchMusicsOperation = new UpdateMatchMusicsOperation({
                    updateMatchMusicsService,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                const updateMusicTest = await updateMatchMusicsOperation.execute(
                    matchMusicsPayload
                );

                expect(updateMatchMusicsService.updateMatchMusics).to.have.been.called();
                expect(updateMatchMusicsService.save).to.have.been.called();
                expect(updateMusicTest[0]).to.have.property('title');
                expect(updateMusicTest[0].title).to.be.equal(
                    campaign.matchData.musics[0].title
                );
            });
        });
    });
});

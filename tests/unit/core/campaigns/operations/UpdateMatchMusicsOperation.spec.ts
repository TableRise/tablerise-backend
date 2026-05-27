import sinon from 'sinon';
import UpdateMatchMusicsOperation from 'src/core/campaigns/operations/UpdateMatchMusicsOperation';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Operations :: UpdateMatchMusicsOperation', () => {
    let updateMatchMusicsOperation: UpdateMatchMusicsOperation,
        updateMatchMusicsService: any,
        matchMusicsPayload: any,
        campaign: Campaign;

    const logger = (): void => {};
    const socketIO = { emitToCampaign: sinon.spy(), syncActiveCampaign: sinon.spy() } as any;

    context('#execute', () => {
        context('When a campaign has the match musics', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                matchMusicsPayload = {
                    campaignId: campaign.campaignId,
                    id: 'https://youtu.be/123',
                    thumbnail: '',
                    title: 'Main Theme 2',
                };

                if (campaign.matchData)
                    campaign.musics = [
                        {
                            title: matchMusicsPayload.title,
                            id: matchMusicsPayload.id,
                            thumbnail: matchMusicsPayload.thumbnail,
                        },
                    ];

                updateMatchMusicsService = {
                    addMatchMusic: sinon.spy(),
                    save: sinon.spy(() => campaign),
                };

                updateMatchMusicsOperation = new UpdateMatchMusicsOperation({
                    updateMatchMusicsService,
                    socketIO,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                const updateMusicTest = await updateMatchMusicsOperation.add(matchMusicsPayload);

                expect(updateMatchMusicsService.addMatchMusic).to.have.been.called();
                expect(updateMatchMusicsService.save).to.have.been.called();
                expect(updateMusicTest[0]).to.have.property('title');
                expect(updateMusicTest[0].title).to.be.equal(campaign.musics[0].title);
            });
        });
    });
});

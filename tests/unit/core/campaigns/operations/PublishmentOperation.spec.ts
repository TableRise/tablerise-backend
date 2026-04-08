import sinon from 'sinon';
import PublishmentOperation from 'src/core/campaigns/operations/PublishmentOperation';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import newUUID from 'src/domains/common/helpers/newUUID';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Operations :: publishmentOperation', () => {
    let publishmentOperation: PublishmentOperation, publishmentService: any, campaign: Campaign, postPayload: any;

    const logger = (): void => {};

    context('#execute', () => {
        before(() => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];

            campaign.infos.announcements = [
                {
                    title: 'New post',
                    content: 'Content of new post',
                    author: 'Some author',
                },
            ];

            publishmentService = {
                addPost: sinon.spy(() => campaign),
                save: sinon.spy(() => campaign),
            };

            postPayload = {
                campaignId: campaign.campaignId,
                userId: newUUID(),
                payload: {},
            };

            publishmentOperation = new PublishmentOperation({
                publishmentService,
                logger,
            });
        });

        it('should return correct data with correct call', async () => {
            const campaignToPost = await publishmentOperation.execute(postPayload);

            expect(publishmentService.addPost).to.have.been.calledWith(postPayload);
            expect(publishmentService.save).to.have.been.calledWith(campaign);
            expect(campaignToPost).to.be.deep.equal(campaign);
        });
    });
});

import sinon from 'sinon';
import PublishPostOperation from 'src/core/campaigns/operations/campaigns/PublishPostOperation';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import newUUID from 'src/domains/common/helpers/newUUID';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Operations :: PublishPostOperation', () => {
    let publishPostOperation: PublishPostOperation,
        publishPostService: any,
        schemaValidator: any,
        campaign: CampaignInstance,
        postPayload: any,
        campaignsSchema: any;

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

            publishPostService = {
                addPost: sinon.spy(() => campaign),
                save: sinon.spy(() => campaign),
            };

            schemaValidator = {
                entry: sinon.spy(() => {}),
            };

            campaignsSchema = {
                campaignPost: {},
            };

            postPayload = {
                campaignId: campaign.campaignId,
                userId: newUUID(),
                payload: {},
            };

            publishPostOperation = new PublishPostOperation({
                publishPostService,
                schemaValidator,
                campaignsSchema,
                logger,
            });
        });

        it('should return correct data with correct call', async () => {
            const campaignToPost = await publishPostOperation.execute(postPayload);

            expect(publishPostService.addPost).to.have.been.calledWith(postPayload);
            expect(publishPostService.save).to.have.been.calledWith(campaign);
            expect(campaignToPost).to.be.deep.equal(campaign);
        });
    });
});

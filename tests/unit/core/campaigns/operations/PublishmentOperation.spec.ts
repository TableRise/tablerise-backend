import sinon from 'sinon';
import PublishmentOperation from 'src/core/campaigns/operations/PublishmentOperation';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import newUUID from 'src/domains/common/helpers/newUUID';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Operations :: publishmentOperation', () => {
    let publishmentOperation: PublishmentOperation,
        publishmentService: any,
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

            publishmentService = {
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

            publishmentOperation = new PublishmentOperation({
                publishmentService,
                schemaValidator,
                campaignsSchema,
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

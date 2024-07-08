import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('when the email invitation is sent', () => {
    let campaign: CampaignInstance;

    context('And data is correct', () => {
        before(async () => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];

            await InjectNewCampaign(campaign);
        });

        it('must send email successfully', async () => {
            await requester()
                .post(
                    `/campaigns/${campaign.campaignId}/invite?targetEmail=test@email.com`
                )
                .expect(HttpStatusCode.NO_CONTENT);
        });
    });
});

import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('when the email invitation is sent', () => {
    let campaign: Campaign;

    context('And data is correct', () => {
        before(async () => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];

            await InjectNewCampaign(campaign);
        });

        it('must send email successfully', async () => {
            await requester()
                .post(`/campaigns/${campaign.campaignId as string}/invite?targetEmail=test@email.com`)
                .expect(HttpStatusCode.NO_CONTENT);
        });
    });
});

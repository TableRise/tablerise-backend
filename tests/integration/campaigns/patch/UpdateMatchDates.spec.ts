import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When a date is added or removed from a match', () => {
    let campaign: Campaign, date: string;

    before(async () => {
        campaign = DomainDataFaker.generateCampaignsJSON()[0];
        await InjectNewCampaign(campaign);

        date = '2024-01-01';
    });

    it('should sucessfully add a date to a campaign', async () => {
        const { body } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/infos/match-dates?operation=add&date=${date}`)
            .expect(HttpStatusCode.OK);

        expect(body).to.be.an('string');
        expect(body).to.be.equal(date);
    });

    it('should sucessfully remove a date from a campaign', async () => {
        const { body } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/infos/match-dates?operation=remove&date=${date}`)
            .expect(HttpStatusCode.OK);

        expect(body).to.be.an('string');
    });
});

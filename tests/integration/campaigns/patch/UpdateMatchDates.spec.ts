// import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
// import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
// import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
// import { InjectNewCampaign } from 'tests/support/dataInjector';
// import requester from 'tests/support/requester';

// describe('When a date is added or removed from a match', () => {
//     let campaign: CampaignInstance, date: string;

//     before(async () => {
//         campaign = DomainDataFaker.generateCampaignsJSON()[0];
//         await InjectNewCampaign(campaign);

//         date = '20240101';
//     });

//     it('should sucessfully add a date to a campaign', async () => {
//         const { body } = await requester()
//             .patch(
//                 `/campaigns/${campaign.campaignId}/update/infos/match-dates?operation=add&date=${date}`
//             )
//             .expect(HttpStatusCode.OK);

//         expect(body).to.be.an('array').with.lengthOf(1);
//         expect(body[0]).to.be.equal(date);
//     });

//     it('should sucessfully remove a date from a campaign', async () => {
//         const { body } = await requester()
//             .patch(
//                 `/campaigns/${campaign.campaignId}/update/infos/match-dates?operation=remove&date=${date}`
//             )
//             .expect(HttpStatusCode.OK);

//         expect(body).to.be.an('array').with.lengthOf(0);
//     });
// });

import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';
import DomainDataFakerUsers from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';

describe('When a campaign is updated', () => {
    let campaign: Campaign, newCampaignPayload: any;

    before(async () => {
        campaign = DomainDataFaker.generateCampaignsJSON()[0];
        await InjectNewCampaign(campaign);

        newCampaignPayload = {
            title: 'Main Theme',
            description: 'New desc',
            mainHistory: 'A refreshed campaign history',
            visibility: 'hidden',
        };
    });

    it('should sucessfully update a campaign', async () => {
        const { body } = await requester()
            .put(`/campaigns/${campaign.campaignId as string}/update`)
            .send(newCampaignPayload)
            .expect(HttpStatusCode.OK);

        expect(body).to.have.property('title');
        expect(body.title).to.be.equal(newCampaignPayload.title);
        expect(body.description).to.be.equal(newCampaignPayload.description);
        expect(body.mainHistory).to.be.equal(newCampaignPayload.mainHistory);
        expect(body.infos.visibility).to.be.equal(newCampaignPayload.visibility);
    });

    it('should award admin xp only once per campaign and promoted user pair', async () => {
        const campaignToPromote = DomainDataFaker.generateCampaignsJSON()[0];
        const promotedUser = DomainDataFakerUsers.generateUsersJSON()[0];
        promotedUser.inProgress = {
            status: InProgressStatusEnum.enum.DONE,
            currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
            prevStatusWas: InProgressStatusEnum.enum.DONE,
            nextStatusWillBe: InProgressStatusEnum.enum.DONE,
            code: '',
        };
        const promotedUserDetails = DomainDataFakerUsers.generateUserDetailsJSON()[0];
        promotedUserDetails.userId = promotedUser.userId;

        campaignToPromote.campaignPlayers = [
            {
                userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                characterIds: [],
                role: 'dungeon_master',
                status: 'active',
            },
            {
                userId: promotedUser.userId,
                characterIds: [],
                role: 'player',
                status: 'active',
            },
        ] as any;

        await InjectNewUser(promotedUser);
        await InjectNewUserDetails(promotedUserDetails, promotedUser.userId);
        await InjectNewCampaign(campaignToPromote);

        await requester()
            .put(`/campaigns/${campaignToPromote.campaignId as string}/update`)
            .send({ adminId: promotedUser.userId })
            .expect(HttpStatusCode.OK);

        const { body: promotedUserAfterFirstGrant } = await requester()
            .get(`/users/${promotedUser.userId}`)
            .expect(HttpStatusCode.OK);
        expect(promotedUserAfterFirstGrant.details.xp).to.equal(150);

        await requester()
            .put(`/campaigns/${campaignToPromote.campaignId as string}/update`)
            .send({ adminId: 'none' })
            .expect(HttpStatusCode.OK);

        await requester()
            .put(`/campaigns/${campaignToPromote.campaignId as string}/update`)
            .send({ adminId: promotedUser.userId })
            .expect(HttpStatusCode.OK);

        const { body: promotedUserAfterSecondGrant } = await requester()
            .get(`/users/${promotedUser.userId}`)
            .expect(HttpStatusCode.OK);
        expect(promotedUserAfterSecondGrant.details.xp).to.equal(150);
    });
});

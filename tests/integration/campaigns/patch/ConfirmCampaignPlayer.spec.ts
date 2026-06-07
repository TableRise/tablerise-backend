import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import Campaign, { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import CampaignDomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import UsersDomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewCampaign, InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When a master confirms a player in a campaign', () => {
    let campaign: Campaign;
    let acceptedUser: User;
    let acceptedUserDetails: UserDetail;

    const dungeonMasterId = '12cd093b-0a8a-42fe-910f-001f2ab28454';

    beforeEach(async () => {
        campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
        campaign.campaignPlayers = [
            {
                userId: dungeonMasterId,
                characterIds: [],
                role: 'dungeon_master',
                status: 'active',
            },
        ] as Player[];
        campaign.infos.highlightedJournal = {
            title: 'Campaign highlight',
            author: campaign.campaignPlayers[0],
            content: 'Pending players waiting for confirmation.',
            timestamp: new Date().toISOString(),
            category: 'announcements',
        };

        acceptedUser = UsersDomainDataFaker.generateUsersJSON()[0];
        acceptedUser.inProgress = {
            status: InProgressStatusEnum.enum.DONE,
            currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
            prevStatusWas: InProgressStatusEnum.enum.DONE,
            nextStatusWillBe: InProgressStatusEnum.enum.DONE,
            code: '',
        };

        acceptedUserDetails = UsersDomainDataFaker.generateUserDetailsJSON()[0];
        acceptedUserDetails.userId = acceptedUser.userId;
        acceptedUserDetails.gameInfo.campaignsJoinedAmount = 1;

        campaign.campaignPlayers.push({
            userId: acceptedUser.userId,
            characterIds: [],
            role: 'player',
            status: 'pending',
        } as Player);

        await InjectNewUser(acceptedUser);
        await InjectNewUserDetails(acceptedUserDetails, acceptedUser.userId);
        await InjectNewCampaign(campaign);
    });

    it('should increment campaignsJoinedAmount for the accepted player and award the badge at two joins', async () => {
        await requester()
            .patch(
                `/campaigns/${campaign.campaignId as string}/update/player/confirm?userToActivate=${
                    acceptedUser.userId
                }`
            )
            .expect(HttpStatusCode.NO_CONTENT);

        const { body } = await requester().get(`/users/${acceptedUser.userId}`).expect(HttpStatusCode.OK);

        expect(body.details.gameInfo.campaignsJoinedAmount).to.equal(2);
        expect(body.details.gameInfo.badges).to.include('enthusiast');
    });
});

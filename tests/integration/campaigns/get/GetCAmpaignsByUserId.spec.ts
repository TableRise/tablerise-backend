import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import UserDomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewCampaign, InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When recover user by id', () => {
    let campaignOne: Campaign, campaignTwo: Campaign, user: User, userDetails: UserDetail;

    context('And data is correct', () => {
        before(async () => {
            user = UserDomainDataFaker.generateUsersJSON()[0];
            userDetails = UserDomainDataFaker.generateUserDetailsJSON()[0];

            campaignOne = DomainDataFaker.generateCampaignsJSON()[0];
            campaignTwo = DomainDataFaker.generateCampaignsJSON()[0];

            userDetails.gameInfo.campaigns = [
                {
                    campaignId: campaignOne.campaignId,
                    title: campaignOne.title,
                    description: campaignOne.description,
                    role: 'dungeon_master',
                },
                {
                    campaignId: campaignTwo.campaignId,
                    title: campaignTwo.title,
                    description: campaignTwo.description,
                    role: 'player',
                },
            ];

            campaignOne.campaignPlayers = [
                {
                    userId: user.userId,
                    role: 'dungeon_master',
                    characterIds: [],
                    status: 'active',
                },
            ];

            campaignTwo.campaignPlayers = [
                {
                    userId: user.userId,
                    role: 'player',
                    characterIds: [],
                    status: 'active',
                },
            ];

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);

            await InjectNewCampaign(campaignOne);
            await InjectNewCampaign(campaignTwo);
        });

        it('should retrieve campaign created', async () => {
            const { body } = await requester()
                .get(`/campaigns/user/${user.userId as string}`)
                .expect(HttpStatusCode.OK);

            expect(body).to.be.an('object');
            expect(body).to.have.property('master').to.be.an('array').that.has.lengthOf(1);
            expect(body).to.have.property('player').to.be.an('array').that.has.lengthOf(1);
            expect(body.master[0]).to.have.property('campaignId');
            expect(body.player[0]).to.have.property('campaignId');
            expect(body.master[0].campaignId).to.be.equal(campaignOne.campaignId);
            expect(body.player[0].campaignId).to.be.equal(campaignTwo.campaignId);
        });
    });
});

import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import UserDomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewCampaign, InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When recover user by id', () => {
    let campaignOne: CampaignInstance, campaignTwo: CampaignInstance, user: UserInstance, userDetails: UserDetailInstance;

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
                }
            ];

            campaignTwo.campaignPlayers = [
                {
                    userId: user.userId,
                    role: 'player',
                    characterIds: [],
                    status: 'active',
                }
            ];

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);

            await InjectNewCampaign(campaignOne);
            await InjectNewCampaign(campaignTwo);
        });

        it('should retrieve campaign created', async () => {
            const { body } = await requester()
                .get(`/campaigns/user/${user.userId}`)
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

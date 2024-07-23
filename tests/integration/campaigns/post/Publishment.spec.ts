import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import DomainDataFakerUser from 'src/infra/datafakers/users/DomainDataFaker';
import {
    InjectNewCampaign,
    InjectNewUser,
    InjectNewUserDetails,
} from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When a post is published', () => {
    let campaign: CampaignInstance,
        payload: any,
        user: UserInstance,
        userDetails: UserDetailInstance;

    context('And data is correct', () => {
        before(async () => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];
            user = DomainDataFakerUser.generateUsersJSON()[0];
            userDetails = DomainDataFakerUser.generateUserDetailsJSON()[0];

            campaign.campaignPlayers[0].userId = user.userId;

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);
            await InjectNewCampaign(campaign);

            payload = {
                title: 'New character will be added',
                content: 'In next match we will have a new char',
            };
        });

        it('should add new post to campaign', async () => {
            const { body } = await requester()
                .post(
                    `/campaigns/${campaign.campaignId}/publishment?userId=${user.userId}`
                )
                .send(payload)
                .expect(HttpStatusCode.CREATED);

            expect(body).to.be.an('object');
            expect(body.infos).to.have.property('announcements');
            expect(body.infos.announcements).to.be.an('array');
            expect(body.infos.announcements[0].title).to.be.equal(payload.title);
            expect(body.infos.announcements[0].content).to.be.equal(payload.content);
            expect(body.infos.announcements[0].author).to.be.equal(user.nickname);
        });
    });
});

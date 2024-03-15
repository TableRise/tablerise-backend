import sinon from 'sinon';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import CampaignDomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import requester from 'tests/support/requester';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';

describe('When a campaign is created', () => {
    let user: UserInstance, userDetails: UserDetailInstance;

    context('And all data is correct', () => {
        before(async () => {
            user = DomainDataFaker.generateUsersJSON()[0];
            userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            user.inProgress = { status: 'done', code: '' };

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);
        });

        after(() => {
            sinon.restore();
        });

        it('should return correct campaign created', async () => {
            const login = {
                email: user.email,
                password: 'TheWorld@122',
            };

            const { headers } = await requester()
                .post('/profile/login')
                .send(login)
                .expect(HttpStatusCode.OK);

            const campaignPayload = CampaignDomainDataFaker.mocks.createCampaignMock;

            const { body } = await requester()
                .post('/campaigns/create')
                .set('Cookie', headers['set-cookie'][0].split(';')[0])
                .send(campaignPayload);

            expect(body).to.have.property('campaignId');
            expect(body).to.have.property('title');
            expect(body.title).to.be.equal(campaignPayload.title);
            expect(body).to.have.property('cover');
            expect(body.cover).to.be.equal(null);
            expect(body).to.have.property('description');
            expect(body.description).to.be.equal(campaignPayload.description);
            expect(body).to.have.property('ageRestriction');
            expect(body.ageRestriction).to.be.equal(campaignPayload.ageRestriction);
            expect(body).to.have.property('system');
            expect(body.system).to.be.equal(campaignPayload.system);
            expect(body).to.have.property('campaignPlayers');
            expect(body.campaignPlayers[0].userId).to.be.equal(user.userId);
            expect(body).to.have.property('matchData');
            expect(body.matchData).to.be.equal(null);
            expect(body).to.have.property('infos');
            expect(body.infos.visibility).to.be.equal(campaignPayload.visibility);
            expect(body).to.have.property('lores');
            expect(body.lores).to.be.equal(null);
            expect(body).to.have.property('createdAt');
            expect(body).to.have.property('updatedAt');
        });
    });
});

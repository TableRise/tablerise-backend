import sinon from 'sinon';
import FormData from 'form-data';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import CampaignDomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import requester from 'tests/support/requester';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import DatabaseManagement from '@tablerise/database-management';
import newUUID from 'src/domains/common/helpers/newUUID';

describe('When a campaign is created', function () {
    this.timeout(30000);

    let user: User, userDetails: UserDetail;

    context('And all data is correct', () => {
        const userLoggedId = '12cd093b-0a8a-42fe-910f-001f2ab28454';
        const userLoggedDetailsId = 'ff2abce1-fc9e-41d7-b8ab-8cb599adb111';
        const userDetailsModel = new DatabaseManagement().modelInstance('user', 'UserDetails');

        before(async () => {
            user = DomainDataFaker.generateUsersJSON()[0];
            userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            user.inProgress = {
                status: InProgressStatusEnum.enum.DONE,
                currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
                prevStatusWas: InProgressStatusEnum.enum.DONE,
                nextStatusWillBe: InProgressStatusEnum.enum.DONE,
                code: '',
            };

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);

            const authenticatedUserDetails = await userDetailsModel.findOne({ userDetailId: userLoggedDetailsId });
            authenticatedUserDetails.gameInfo.campaigns = Array.from({ length: 9 }, (_, index) => ({
                campaignId: newUUID(),
                notes: [],
            }));
            authenticatedUserDetails.gameInfo.badges = [];

            await userDetailsModel.update({ userDetailId: userLoggedDetailsId }, authenticatedUserDetails);
        });

        after(() => {
            sinon.restore();
        });

        it('should return correct campaign created', async () => {
            const campaignPayload = CampaignDomainDataFaker.mocks.createCampaignMock;

            campaignPayload.cover = new FormData() as unknown as { isBinary: boolean };

            const { body } = await requester()
                .post('/campaigns/create')
                .field('title', campaignPayload.title)
                .field('description', campaignPayload.description)
                .field('visibility', campaignPayload.visibility as string)
                .field('system', campaignPayload.system)
                .field('ageRestriction', campaignPayload.ageRestriction)
                .field('password', campaignPayload.password)
                .field('playerAmountLimit', campaignPayload.playerAmountLimit)
                .field('musics', '[]')
                .field('configurations[xpSystem]', String(campaignPayload.configurations.xpSystem))
                .field('configurations[shopSystem]', String(campaignPayload.configurations.shopSystem))
                .field('lore', 'A great adventure begins')
                .expect(HttpStatusCode.CREATED);

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
            expect(body.campaignPlayers[0].userId).to.be.equal(userLoggedId);
            expect(body).to.have.property('matchData');
            expect(body.matchData).to.be.an('object');
            expect(body).to.have.property('infos');
            expect(body.infos.visibility).to.be.equal(campaignPayload.visibility);
            expect(body).to.have.property('configurations');
            expect(body.configurations.xpSystem).to.be.equal(campaignPayload.configurations.xpSystem);
            expect(body.configurations.shopSystem).to.be.equal(campaignPayload.configurations.shopSystem);
            expect(body).to.have.property('createdAt');
            expect(body).to.have.property('updatedAt');

            const { body: authenticatedUserUpdated } = await requester()
                .get(`/users/${userLoggedId}`)
                .expect(HttpStatusCode.OK);
            expect(authenticatedUserUpdated.details.gameInfo.badges).to.include('badge_10_campaigns');
        });
    });
});

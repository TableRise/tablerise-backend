import sinon from 'sinon';
import PostInvitationEmailOperation from 'src/core/campaigns/operations/PostInvitationEmailOperation';
import newUUID from 'src/domains/common/helpers/newUUID';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Operations :: PostInvitationEmailOperation', () => {
    let postInvitationEmailOperation: PostInvitationEmailOperation,
        postInvitationEmailService: any,
        getCampaignByIdService: any,
        usersRepository: any,
        campaign: CampaignInstance,
        payload: any;

    const logger = (): void => {};

    context('When get users with success', () => {
        before(() => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];

            postInvitationEmailService = {
                sendEmail: sinon.spy(() => ({})),
            };

            getCampaignByIdService = {
                get: sinon.spy(() => ({})),
            };

            payload = {
                campaignId: campaign.campaignId,
                targetEmail: 'teste@email.com',
                userId: newUUID(),
                username: 'joaquim',
            };

            usersRepository = {
                findOne: sinon.spy(() => ({ userId: '123', nickname: 'user' })),
            };

            postInvitationEmailOperation = new PostInvitationEmailOperation({
                postInvitationEmailService,
                getCampaignByIdService,
                usersRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            await postInvitationEmailOperation.execute(payload);

            expect(postInvitationEmailService.sendEmail).to.have.been.called();
        });
    });
});

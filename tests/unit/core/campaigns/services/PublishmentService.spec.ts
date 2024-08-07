import sinon from 'sinon';
import PublishmentService from 'src/core/campaigns/services/PublishmentService';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import DomainDataFakerUser from 'src/infra/datafakers/users/DomainDataFaker';

describe('Core :: Services :: publishmentService', () => {
    let publishmentService: PublishmentService,
        campaignsRepository: any,
        usersRepository: any,
        postPayload: any,
        campaign: CampaignInstance,
        user: UserInstance;

    const logger = (): void => {};

    context('When a new post is added to the campaign', () => {
        before(() => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];
            user = DomainDataFakerUser.generateUsersJSON()[0];

            campaign.infos.announcements = [];

            campaignsRepository = {
                findOne: sinon.spy(() => campaign),
            };

            usersRepository = {
                findOne: sinon.spy(() => user),
            };

            postPayload = {
                campaignId: campaign.campaignId,
                userId: user.userId,
                payload: {
                    title: 'Some new title',
                    content: 'Some new content',
                },
            };

            publishmentService = new PublishmentService({
                campaignsRepository,
                usersRepository,
                logger,
            });
        });

        it('should return correct data', async () => {
            const campaignWithPost = await publishmentService.addPost(postPayload);

            expect(campaignWithPost.infos).to.have.property('announcements');
            expect(campaignWithPost.infos.announcements).to.be.an('array');
            expect(campaignWithPost.infos.announcements[0]).to.have.property('title');
            expect(campaignWithPost.infos.announcements[0]).to.have.property('content');
            expect(campaignWithPost.infos.announcements[0]).to.have.property('author');
            expect(campaignWithPost.infos.announcements[0].title).to.be.equal(
                postPayload.payload.title
            );
            expect(campaignWithPost.infos.announcements[0].content).to.be.equal(
                postPayload.payload.content
            );
            expect(campaignWithPost.infos.announcements[0].author).to.be.equal(
                user.nickname
            );
        });
    });

    context('When campaign is saved with new post', () => {
        before(() => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];
            user = DomainDataFakerUser.generateUsersJSON()[0];

            campaignsRepository = {
                update: sinon.spy(() => campaign),
            };

            usersRepository = {
                findOne: sinon.spy(() => user),
            };

            publishmentService = new PublishmentService({
                campaignsRepository,
                usersRepository,
                logger,
            });
        });

        it('should return correct data', async () => {
            const campaignSaved = await publishmentService.save(campaign);

            expect(campaignsRepository.update).to.have.been.calledWith({
                query: { campaignId: campaign.campaignId },
                payload: campaign,
            });
            expect(campaignSaved).to.be.deep.equal(campaign);
        });
    });
});

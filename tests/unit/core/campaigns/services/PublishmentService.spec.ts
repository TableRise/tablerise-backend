import sinon from 'sinon';
import PublishmentService from 'src/core/campaigns/services/PublishmentService';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Services :: PublishmentService', () => {
    let publishmentService: PublishmentService;
    let campaignsRepository: any;
    let campaign: Campaign;

    const logger = (): void => {};

    beforeEach(() => {
        campaign = DomainDataFaker.generateCampaignsJSON({ count: 1 })[0];
        campaign.campaignPlayers = [
            {
                userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                characterIds: [],
                role: 'player',
                status: 'active',
            },
        ];
        campaign.infos.journal = [];

        campaignsRepository = {
            findOne: sinon.stub().resolves(campaign),
            update: sinon.stub().callsFake(async ({ payload }) => payload),
        };

        publishmentService = new PublishmentService({
            campaignsRepository,
            logger,
        } as any);
    });

    it('should append a new journal post with postId', async () => {
        const result = await publishmentService.addPost({
            campaignId: campaign.campaignId as string,
            userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
            payload: {
                title: 'Session recap',
                content: 'The party reached the bridge.',
                category: 'players',
            },
        });

        expect(result.infos.journal).to.have.lengthOf(1);
        expect(result.infos.journal[0]).to.include({
            title: 'Session recap',
            content: 'The party reached the bridge.',
            category: 'players',
        });
        expect(result.infos.journal[0].author.userId).to.be.equal('12cd093b-0a8a-42fe-910f-001f2ab28454');
        expect((result.infos.journal[0] as any).postId).to.be.a('string');
    });

    it('should persist the campaign', async () => {
        const result = await publishmentService.save(campaign);

        expect(campaignsRepository.update).to.have.been.calledWith({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
        expect(result).to.be.deep.equal(campaign);
    });
});

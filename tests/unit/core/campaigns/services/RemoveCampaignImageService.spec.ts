import sinon from 'sinon';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import RemoveCampaignImageService from 'src/core/campaigns/services/RemoveCampaignImageService';

describe('Core :: Campaigns :: Services :: RemoveCampaignImageService', () => {
    const logger = (): void => {};

    it('should remove the campaign cover', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        const campaignsRepository = {
            findOne: sinon.stub().resolves(campaign),
        };

        const service = new RemoveCampaignImageService({
            campaignsRepository,
            logger,
        } as any);

        const updated = await service.removeCover({ campaignId: campaign.campaignId as string });

        expect((updated as any).cover).to.equal(null);
    });

    it('should remove a map image and clear activeMapId when it no longer exists', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        campaign.matchData.mapImages = [
            { id: 'map-1', link: 'https://map-1' },
            { id: 'map-2', link: 'https://map-2' },
        ] as any;
        (campaign.matchData as any).state = (campaign.matchData as any).state ?? {};
        (campaign.matchData as any).state.activeMapId = 'map-1';

        const campaignsRepository = {
            findOne: sinon.stub().resolves(campaign),
            update: sinon.stub().resolves(campaign),
        };

        const service = new RemoveCampaignImageService({
            campaignsRepository,
            logger,
        } as any);

        const updated = await service.removeMatchMapImage({
            campaignId: campaign.campaignId as string,
            imageUrl: 'https://map-1',
        });

        expect(updated.matchData.mapImages).to.have.lengthOf(1);
        expect((updated.matchData as any).state.activeMapId).to.equal(null);
    });

    it('should preserve activeMapId when another matching map still exists', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        campaign.matchData.mapImages = [
            { id: 'map-1', link: 'https://map-1' },
            { id: 'map-2', link: 'https://map-2' },
        ] as any;
        (campaign.matchData as any).state = (campaign.matchData as any).state ?? {};
        (campaign.matchData as any).state.activeMapId = 'map-2';

        const campaignsRepository = {
            findOne: sinon.stub().resolves(campaign),
        };

        const service = new RemoveCampaignImageService({
            campaignsRepository,
            logger,
        } as any);

        const updated = await service.removeMatchMapImage({
            campaignId: campaign.campaignId as string,
            imageUrl: 'https://map-1',
        });

        expect((updated.matchData as any).state.activeMapId).to.equal('map-2');
    });

    it('should skip map removal logic when matchData is missing', async () => {
        const campaign = {
            ...DomainDataFaker.generateCampaignsJSON()[0],
            matchData: null,
        };
        const campaignsRepository = {
            findOne: sinon.stub().resolves(campaign),
        };

        const service = new RemoveCampaignImageService({
            campaignsRepository,
            logger,
        } as any);

        const updated = await service.removeMatchMapImage({
            campaignId: campaign.campaignId as string,
            imageUrl: 'https://map-1',
        });

        expect(updated.matchData).to.equal(null);
    });

    it('should preserve the state when there is no active map selected', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        campaign.matchData.mapImages = [{ id: 'map-1', link: 'https://map-1' }] as any;
        (campaign.matchData as any).state = {};

        const campaignsRepository = {
            findOne: sinon.stub().resolves(campaign),
        };

        const service = new RemoveCampaignImageService({
            campaignsRepository,
            logger,
        } as any);

        const updated = await service.removeMatchMapImage({
            campaignId: campaign.campaignId as string,
            imageUrl: 'https://map-1',
        });

        expect((updated.matchData as any).state.activeMapId).to.equal(undefined);
    });

    it('should preserve map removal when state is missing entirely', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        campaign.matchData.mapImages = [{ id: 'map-1', link: 'https://map-1' }] as any;
        delete (campaign.matchData as any).state;

        const campaignsRepository = {
            findOne: sinon.stub().resolves(campaign),
        };

        const service = new RemoveCampaignImageService({
            campaignsRepository,
            logger,
        } as any);

        const updated = await service.removeMatchMapImage({
            campaignId: campaign.campaignId as string,
            imageUrl: 'https://map-1',
        });

        expect(updated.matchData.mapImages).to.have.lengthOf(0);
        expect((updated.matchData as any).state).to.equal(undefined);
    });

    it('should persist the updated campaign', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        const campaignsRepository = {
            update: sinon.stub().resolves(campaign),
        };

        const service = new RemoveCampaignImageService({
            campaignsRepository,
            logger,
        } as any);

        const saved = await service.save(campaign);

        expect(saved).to.deep.equal(campaign);
        expect(campaignsRepository.update).to.have.been.calledWith({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    });
});

import sinon from 'sinon';
import UpdateMatchHighlightedImageService from 'src/core/campaigns/services/UpdateMatchHighlightedImageService';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Services :: UpdateMatchHighlightedImageService', () => {
    let updateMatchHighlightedImageService: UpdateMatchHighlightedImageService,
        campaignsRepository: any,
        campaign: Campaign;

    const logger = (): void => {};

    beforeEach(() => {
        campaign = DomainDataFaker.generateCampaignsJSON()[0];
        campaign.matchData.images = [
            {
                id: 'image-1',
                link: 'https://img.bb/image-1',
                uploadDate: new Date().toISOString(),
            } as any,
            {
                id: 'image-2',
                link: 'https://img.bb/image-2',
                uploadDate: new Date().toISOString(),
            } as any,
        ];
        campaign.matchData.imageHighlighted = null as any;

        campaignsRepository = {
            findOne: sinon.stub().resolves(campaign),
            update: sinon.stub().resolves(campaign),
        };

        updateMatchHighlightedImageService = new UpdateMatchHighlightedImageService({
            campaignsRepository,
            logger,
        });
    });

    it('should select the correct image object by id', async () => {
        const updatedCampaign = await updateMatchHighlightedImageService.updateMatchHighlightedImage({
            campaignId: campaign.campaignId as string,
            imageId: 'image-2',
        });

        expect(updatedCampaign.matchData.imageHighlighted?.id).to.equal('image-2');
        expect(updatedCampaign.matchData.images).to.have.lengthOf(2);
    });

    it('should remove the highlighted image when remove is true', async () => {
        campaign.matchData.imageHighlighted = campaign.matchData.images[0] as any;

        const updatedCampaign = await updateMatchHighlightedImageService.updateMatchHighlightedImage({
            campaignId: campaign.campaignId as string,
            remove: true,
        });

        expect(updatedCampaign.matchData.imageHighlighted).to.equal(null);
        expect(updatedCampaign.matchData.images).to.have.lengthOf(2);
    });

    it('should throw when the image does not exist', async () => {
        try {
            await updateMatchHighlightedImageService.updateMatchHighlightedImage({
                campaignId: campaign.campaignId as string,
                imageId: 'missing-image',
            });
            expect.fail('Expected highlighted image lookup to fail');
        } catch (error: any) {
            expect(error.message).to.equal('This content do not exist in the RPG system');
        }
    });

    it('should persist the updated campaign', async () => {
        const campaignSaved = await updateMatchHighlightedImageService.save(campaign);

        expect(campaignSaved).to.deep.equal(campaign);
        expect(campaignsRepository.update).to.have.been.calledWith({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    });
});

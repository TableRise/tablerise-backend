import sinon from 'sinon';
import UpdateMatchImagesService from 'src/core/campaigns/services/UpdateMatchImagesService';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Services :: UpdateMatchImagesService', () => {
    let updateMatchImagesService: UpdateMatchImagesService,
        campaignsRepository: any,
        updateMatchImagesPayload: any,
        imageStorageClient: any,
        campaignImagesLength: number,
        campaign: Campaign;

    const logger = (): void => {};

    context('#updateMatchImages', () => {
        beforeEach(() => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];
            campaign.matchData.images = campaign.matchData.images ?? [];
            campaignImagesLength = campaign.matchData.images.length;

            campaignsRepository = {
                findOne: sinon.stub().resolves({ ...campaign }),
            };

            imageStorageClient = {
                upload: sinon.stub().returns({
                    id: 'image-123',
                    link: 'https://img.bb/gallery',
                    uploadDate: new Date().toISOString(),
                }),
            };

            updateMatchImagesPayload = {
                campaignId: campaign.campaignId,
                images: [{}],
            };

            updateMatchImagesService = new UpdateMatchImagesService({
                logger,
                campaignsRepository,
                imageStorageClient,
            });
        });

        it('should append uploaded images to match data', async () => {
            const matchDataUpdated = await updateMatchImagesService.updateMatchImages(updateMatchImagesPayload);

            expect(matchDataUpdated.matchData.images.length).to.equal(campaignImagesLength + 1);
            expect(matchDataUpdated.matchData.images.at(-1)?.id).to.equal('image-123');
            expect(imageStorageClient.upload).to.have.been.calledOnce;
        });
    });

    context('#save', () => {
        beforeEach(() => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];
            campaign.matchData.images = [DomainDataFaker.generateImagesObjectJSON()[0]];

            campaignsRepository = {
                update: sinon.stub().resolves(campaign),
            };

            updateMatchImagesService = new UpdateMatchImagesService({
                campaignsRepository,
                imageStorageClient: {},
                logger,
            });
        });

        it('should persist the updated campaign', async () => {
            const campaignSaved = await updateMatchImagesService.save(campaign);

            expect(campaignSaved).to.deep.equal(campaign);
            expect(campaignsRepository.update).to.have.been.calledWith({
                query: { campaignId: campaign.campaignId },
                payload: campaign,
            });
        });
    });
});

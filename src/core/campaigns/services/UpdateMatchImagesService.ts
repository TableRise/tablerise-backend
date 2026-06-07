import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { resolveImageUploads } from 'src/domains/common/helpers/resolveImageUpload';
import { TUpdateCampaignMatchImagesBody } from 'src/interface/campaigns/presentation/campaigns/CampaignsSchemas';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { FileObject } from 'src/types/shared/file';
import { appendGalleryImage } from 'src/domains/users/helpers/UserDetailCollections';

export default class UpdateMatchImagesService {
    private readonly campaignsRepository;
    private readonly usersDetailsRepository;
    private readonly imageStorageClient;
    private readonly logger;

    constructor({
        campaignsRepository,
        usersDetailsRepository,
        imageStorageClient,
        logger,
    }: CampaignCoreDependencies['updateMatchImagesServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.imageStorageClient = imageStorageClient;
        this.logger = logger;
    }

    public async updateMatchImages({
        campaignId,
        userId,
        images,
        imageObject,
    }: TUpdateCampaignMatchImagesBody & { campaignId: string; userId: string }): Promise<Campaign> {
        this.logger('info', 'UpdateMatchImages - UpdateMatchImagesService');
        const campaign = await this.campaignsRepository.findOne({ campaignId });

        if (!images && !imageObject) {
            return campaign;
        }

        if (!campaign.matchData) {
            return campaign;
        }

        campaign.matchData.images = campaign.matchData.images ?? [];
        const uploadedImages = await resolveImageUploads({
            images: images as FileObject[] | undefined,
            imageObject: imageObject as any,
            imageStorageClient: this.imageStorageClient,
        });
        campaign.matchData.images.push(...uploadedImages);

        if (imageObject === undefined && uploadedImages.length) {
            const userDetails = await this.usersDetailsRepository.findOne({ userId });
            for (const image of uploadedImages) appendGalleryImage(userDetails, image);
            await this.usersDetailsRepository.update({
                query: { userDetailId: userDetails.userDetailId },
                payload: userDetails,
            });
        }

        return campaign;
    }

    public async save(campaign: Campaign): Promise<Campaign> {
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}

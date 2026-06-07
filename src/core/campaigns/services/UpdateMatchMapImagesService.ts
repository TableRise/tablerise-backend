import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import { resolveImageUploads } from 'src/domains/common/helpers/resolveImageUpload';
import { TUpdateCampaignMatchMapImagesBody } from 'src/interface/campaigns/presentation/campaigns/CampaignsSchemas';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { FileObject } from 'src/types/shared/file';
import { appendGalleryImage } from 'src/domains/users/helpers/UserDetailCollections';

export default class UpdateMatchMapImagesService {
    private readonly campaignsRepository;
    private readonly usersDetailsRepository;
    private readonly imageStorageClient;
    private readonly logger;

    constructor({
        campaignsRepository,
        usersDetailsRepository,
        imageStorageClient,
        logger,
    }: CampaignCoreDependencies['updateMatchMapImagesServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.imageStorageClient = imageStorageClient;
        this.logger = logger;
    }

    async updateMatchMapImage({
        campaignId,
        userId,
        mapImages,
        imageObject,
    }: TUpdateCampaignMatchMapImagesBody & {
        campaignId: string;
        userId: string;
        imageObject?: ImageObject[];
    }): Promise<Campaign> {
        this.logger('info', 'UpdateMatchMapImage - UpdateMatchMapImagesService');
        const campaign = await this.campaignsRepository.findOne({ campaignId });
        const uploadedImages = await resolveImageUploads({
            images: mapImages as FileObject[] | undefined,
            imageObject,
            imageStorageClient: this.imageStorageClient,
        });

        if (uploadedImages.length && campaign.matchData) {
            campaign.matchData.mapImages.push(...uploadedImages);
        }

        if (uploadedImages.length) {
            const userDetails = await this.usersDetailsRepository.findOne({ userId });
            for (const image of uploadedImages) appendGalleryImage(userDetails, image);
            await this.usersDetailsRepository.update({
                query: { userDetailId: userDetails.userDetailId },
                payload: userDetails,
            });
        }

        return campaign;
    }

    async save(campaign: Campaign): Promise<Campaign> {
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}

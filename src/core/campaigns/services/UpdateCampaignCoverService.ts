import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import { resolveImageUpload } from 'src/domains/common/helpers/resolveImageUpload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { FileObject } from 'src/types/shared/file';
import { appendGalleryImage } from 'src/domains/users/helpers/UserDetailCollections';

export default class UpdateCampaignCoverService {
    private readonly campaignsRepository;
    private readonly usersDetailsRepository;
    private readonly imageStorageClient;
    private readonly logger;

    constructor({
        campaignsRepository,
        usersDetailsRepository,
        imageStorageClient,
        logger,
    }: CampaignCoreDependencies['updateCampaignCoverServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.imageStorageClient = imageStorageClient;
        this.logger = logger;
    }

    async updateCover({
        campaignId,
        userId,
        picture,
        imageObject,
    }: {
        campaignId: string;
        userId: string;
        picture?: FileObject;
        imageObject?: ImageObject;
    }): Promise<Campaign> {
        this.logger('info', 'UpdateCover - UpdateCampaignCoverService');

        const campaign = await this.campaignsRepository.findOne({ campaignId });
        const uploaded = await resolveImageUpload({
            image: picture,
            imageObject,
            imageStorageClient: this.imageStorageClient,
        });
        if (!uploaded) {
            throw new HttpRequestErrors({
                message: 'An image file or imageObject is required',
                code: HttpStatusCode.BAD_REQUEST,
                name: getErrorName(HttpStatusCode.BAD_REQUEST),
            });
        }
        campaign.cover = uploaded;

        const userDetails = await this.usersDetailsRepository.findOne({ userId });
        if (imageObject === undefined) {
            appendGalleryImage(userDetails, uploaded);
        }
        await this.usersDetailsRepository.update({
            query: { userDetailId: userDetails.userDetailId },
            payload: userDetails,
        });

        return campaign;
    }

    async save(campaign: Campaign): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.save.name}`;
        this.logger('info', callName);
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}

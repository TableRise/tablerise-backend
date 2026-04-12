import {
    __FullCampaign,
    __CampaignEnriched,
    __CampaignSaved,
    __CampaignSerialized,
} from 'src/types/api/campaigns/methods';
import { CampaignPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import SecurePasswordHandler from 'src/domains/users/helpers/SecurePasswordHandler';
import { FileObject } from 'src/types/shared/file';

export default class CreateCampaignService {
    private readonly campaignsRepository;
    private readonly usersDetailsRepository;
    private readonly serializer;
    private readonly imageStorageClient;
    private readonly logger;

    constructor({
        campaignsRepository,
        usersDetailsRepository,
        logger,
        serializer,
        imageStorageClient,
    }: CampaignCoreDependencies['createCampaignServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.serializer = serializer;
        this.imageStorageClient = imageStorageClient;
        this.logger = logger;

        this.enrichment = this.enrichment.bind(this);
        this.save = this.save.bind(this);
        this.serialize = this.serialize.bind(this);
    }

    public async serialize(campaign: CampaignPayload): Promise<__CampaignSerialized> {
        this.logger('info', 'Serialize - CreateCampaignService');
        return this.serializer.postCampaign(campaign);
    }

    public async enrichment(
        campaign: __FullCampaign,
        userId: string,
        image?: FileObject,
        mapImages?: FileObject[]
    ): Promise<__CampaignEnriched> {
        this.logger('info', 'Enrichment - CreateCampaignService');

        campaign.campaignPlayers = [
            {
                userId,
                characterIds: [],
                role: 'dungeon_master',
                status: 'active',
            },
        ];

        delete campaign.visibility;

        if (image) {
            campaign.cover = await this.imageStorageClient.upload(image);
        } else {
            delete campaign.cover;
        }

        if (mapImages && mapImages.length > 0) {
            const mapImagesUploaded = [];

            for (const image of mapImages) {
                // eslint-disable-next-line no-await-in-loop
                mapImagesUploaded.push(await this.imageStorageClient.upload(image));
            }

            campaign.images = { maps: mapImagesUploaded, characters: [] };
        }

        campaign.lores = {
            playerCharacters: [],
            dungeonMasterCharacters: [],
            environments: [],
            mainHistory: [
                {
                    title: 'Campaign history',
                    lore: campaign.lore as string,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            ],
        };
        campaign.infos.nextMatchDate = 'no-date';
        campaign.createdAt = new Date().toISOString();
        campaign.updatedAt = new Date().toISOString();
        campaign.musics = JSON.parse(campaign.musics as unknown as string);
        campaign.password = await SecurePasswordHandler.hashPassword(campaign.password);

        return campaign;
    }

    public async save(campaign: __CampaignSerialized): Promise<__CampaignSaved> {
        this.logger('info', 'Save - CreateCampaignService');
        const userDetailsInDb = await this.usersDetailsRepository.findOne({
            userId: campaign.campaignPlayers[0].userId,
        });

        const campaignCreated = await this.campaignsRepository.create({
            ...campaign,
        });

        userDetailsInDb.gameInfo.campaigns.push({
            campaignId: campaignCreated.campaignId as string,
            role: campaignCreated.campaignPlayers[0].role,
            title: campaignCreated.title,
            description: campaignCreated.description,
            cover: campaignCreated.cover,
        });

        await this.usersDetailsRepository.update({
            query: { userId: campaign.campaignPlayers[0].userId },
            payload: userDetailsInDb,
        });

        return campaignCreated;
    }
}

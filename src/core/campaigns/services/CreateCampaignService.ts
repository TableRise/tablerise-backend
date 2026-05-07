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
import newUUID from 'src/domains/common/helpers/newUUID';

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

        if (image) {
            campaign.cover = await this.imageStorageClient.upload(image);
        } else {
            delete campaign.cover;
        }

        campaign.infos = {
            ...campaign.infos,
            nextMatchDate: (campaign.nextMatchDate as string) || 'no-date',
            playerAmountLimit: Number(campaign.playerAmountLimit),
            journal: [],
            campaignAge: '0',
            socialMedia: {
                ...JSON.parse(campaign.socialMedia as string),
            },
        };

        campaign.matchData = {
            matchId: newUUID(),
            prevDate: campaign.nextMatchDate as string,
            confirmedPlayers: [],
            characters: [],
            charactersInGame: [],
            musics: [],
            mapImages: [],
            logs: [],
        };

        if (mapImages) {
            for (const mapImage of mapImages) {
                campaign.matchData.mapImages.push(await this.imageStorageClient.upload(mapImage));
            }
        }

        campaign.createdAt = new Date().toISOString();
        campaign.updatedAt = new Date().toISOString();
        campaign.musics = JSON.parse(campaign.musics as unknown as string);

        if (campaign.password) {
            campaign.password = await SecurePasswordHandler.hashPassword(campaign.password);
        } else {
            campaign.password = 'no-password';
        }

        (campaign as any).code = String(Math.floor(100000 + Math.random() * 900000));

        delete campaign.visibility;
        delete campaign.socialMedia;
        delete campaign.lore;
        delete campaign.nextMatchDate;
        delete campaign.playerAmountLimit;

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
            notes: [],
        });

        await this.usersDetailsRepository.update({
            query: { userId: campaign.campaignPlayers[0].userId },
            payload: userDetailsInDb,
        });

        return campaignCreated;
    }
}

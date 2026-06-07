import {
    __FullCampaign,
    __CampaignEnriched,
    __CampaignSaved,
    __CampaignSerialized,
} from 'src/types/api/campaigns/methods';
import { CampaignPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import SecurePasswordHandler from 'src/domains/users/helpers/SecurePasswordHandler';
import { incrementGameInfoCounter } from 'src/domains/users/helpers/GameInfoCounters';
import { FileObject } from 'src/types/shared/file';
import newUUID from 'src/domains/common/helpers/newUUID';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { awardCampaignBadges } from 'src/domains/users/helpers/BadgeAwardHandler';
import { appendGalleryImage } from 'src/domains/users/helpers/UserDetailCollections';
import { resolveImageUpload, resolveImageUploads } from 'src/domains/common/helpers/resolveImageUpload';

function normalizeBooleanValue(value: boolean | string | undefined): boolean {
    return value === true || value === 'true';
}

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
        const callName = `[${this.constructor.name}] - ${this.serialize.name}`;
        this.logger('info', callName);
        return this.serializer.postCampaign(campaign);
    }

    public async enrichment(
        campaign: __FullCampaign,
        userId: string,
        image?: FileObject,
        mapImages?: FileObject[],
        imageObject?: {
            cover?: ImageObject;
            mapImages?: ImageObject[];
        }
    ): Promise<__CampaignEnriched> {
        this.logger('info', 'Enrichment - CreateCampaignService');
        const socialMedia =
            typeof campaign.socialMedia === 'string' ? JSON.parse(campaign.socialMedia) : campaign.socialMedia ?? {};
        const configurationsPayload =
            typeof campaign.configurations === 'string'
                ? JSON.parse(campaign.configurations)
                : campaign.configurations ?? {};
        const configurations: Campaign['configurations'] = {
            xpSystem: normalizeBooleanValue((configurationsPayload as Record<string, unknown>).xpSystem as any),
            shopSystem: normalizeBooleanValue((configurationsPayload as Record<string, unknown>).shopSystem as any),
            shopOn: normalizeBooleanValue((configurationsPayload as Record<string, unknown>).shopOn as any),
        };

        campaign.campaignPlayers = [
            {
                userId,
                characterIds: [],
                role: 'dungeon_master',
                notes: [],
                status: 'active',
            },
        ];

        const coverImage = await resolveImageUpload({
            image,
            imageObject: imageObject?.cover,
            imageStorageClient: this.imageStorageClient,
        });

        if (coverImage) {
            campaign.cover = coverImage;
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
                ...socialMedia,
            },
        };

        campaign.configurations = {
            ...configurations,
            shopOn: configurations.shopOn || configurations.shopSystem,
        };
        campaign.buys = [];

        campaign.matchData = {
            matchId: newUUID(),
            prevDate: campaign.nextMatchDate as string,
            confirmedPlayers: [],
            characters: [],
            charactersInGame: [],
            actualMapImage: {} as Campaign['matchData']['actualMapImage'],
            mapImages: [],
            images: [],
            imageHighlighted: null as unknown as Campaign['matchData']['imageHighlighted'],
            logs: [],
            state: {
                activeMapId: null,
                gridVisible: true,
                activeEffect: null,
                playingMusicId: null,
                visibleCharacterIds: [],
                tokens: [],
            },
        } as Campaign['matchData'];

        campaign.matchData.mapImages.push(
            ...(await resolveImageUploads({
                images: mapImages,
                imageObject: imageObject?.mapImages,
                imageStorageClient: this.imageStorageClient,
            }))
        );

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

        return campaign as __CampaignEnriched;
    }

    public async save(campaign: __CampaignSerialized): Promise<__CampaignSaved> {
        const callName = `[${this.constructor.name}] - ${this.save.name}`;
        this.logger('info', callName);
        const userDetailsInDb = await this.usersDetailsRepository.findOne({
            userId: campaign.campaignPlayers[0].userId,
        });
        if (!userDetailsInDb) HttpRequestErrors.throwError('user-inexistent');

        const campaignCreated = await this.campaignsRepository.create({
            ...campaign,
        });

        incrementGameInfoCounter(userDetailsInDb, 'campaignsCreatedAmount');
        userDetailsInDb.gameInfo.campaigns.push(campaignCreated.campaignId as string);
        awardCampaignBadges(userDetailsInDb);
        if (campaignCreated.cover) appendGalleryImage(userDetailsInDb, campaignCreated.cover);
        for (const image of campaignCreated.matchData?.mapImages ?? []) {
            appendGalleryImage(userDetailsInDb, image);
        }

        await this.usersDetailsRepository.update({
            query: { userId: campaign.campaignPlayers[0].userId },
            payload: userDetailsInDb,
        });

        return campaignCreated;
    }
}

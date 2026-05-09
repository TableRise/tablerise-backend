import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import {
    AddMatchMusicPayload,
    EditMatchMusicPayload,
    RemoveMatchMusicPayload,
} from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateMatchMusicsService {
    private readonly campaignsRepository;
    private readonly logger;

    constructor({ campaignsRepository, logger }: CampaignCoreDependencies['updateMatchMusicsServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;
    }

    async addMatchMusic({ campaignId, id, title, thumbnail }: AddMatchMusicPayload): Promise<Campaign> {
        this.logger('info', 'AddMatchMusic - UpdateMatchMusicsService');
        const campaign = await this.campaignsRepository.findOne({ campaignId });
        campaign.musics = campaign.musics ?? campaign.matchData?.musics ?? [];

        const musicWithSameLinkExists = campaign.musics.find((music) => music.id === id);

        if (musicWithSameLinkExists) HttpRequestErrors.throwError('music-link-already-added');

        campaign.musics.push({
            title,
            id,
            thumbnail,
        });

        return campaign;
    }

    async removeMatchMusic({ campaignId, id }: RemoveMatchMusicPayload): Promise<Campaign> {
        this.logger('info', 'RemoveMatchMusic - UpdateMatchMusicsService');
        const campaign = await this.campaignsRepository.findOne({ campaignId });
        campaign.musics = campaign.musics ?? campaign.matchData?.musics ?? [];

        campaign.musics = campaign.musics.filter((music) => music.id !== id);

        if ((campaign.matchData as any)?.state?.playingMusicId === id) {
            (campaign.matchData as any).state.playingMusicId = null;
        }

        return campaign;
    }

    async editMatchMusic({ campaignId, id, title, thumbnail }: EditMatchMusicPayload): Promise<Campaign> {
        this.logger('info', 'EditMatchMusic - UpdateMatchMusicsService');
        const campaign = await this.campaignsRepository.findOne({ campaignId });
        campaign.musics = campaign.musics ?? campaign.matchData?.musics ?? [];

        campaign.musics = campaign.musics.map((music) => (music.id === id ? { ...music, title, thumbnail } : music));

        return campaign;
    }

    async save(campaign: Campaign): Promise<Campaign> {
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}

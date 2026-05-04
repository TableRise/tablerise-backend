import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { UpdateMatchMusicsPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateMatchMusicsService {
    private readonly campaignsRepository;
    private readonly logger;

    constructor({ campaignsRepository, logger }: CampaignCoreDependencies['updateMatchMusicsServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;
    }

    async updateMatchMusics({
        campaignId,
        id,
        title,
        thumbnail,
        operation,
    }: UpdateMatchMusicsPayload): Promise<Campaign> {
        this.logger('info', 'UpdateMatchMusics - UpdateMatchMusicsService');
        const campaign = await this.campaignsRepository.findOne({ campaignId });

        if (operation === 'add' && campaign.musics) {
            const musicWithSameLinkExists = campaign.musics.find((music) => music.id === id);

            if (musicWithSameLinkExists) HttpRequestErrors.throwError('music-link-already-added');

            campaign.musics.push({
                title,
                id,
                thumbnail,
            });
        }

        if (operation === 'remove' && campaign.musics)
            campaign.musics = campaign.musics.filter((musics) => musics.title !== title);

        return campaign;
    }

    async save(campaign: Campaign): Promise<Campaign> {
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}

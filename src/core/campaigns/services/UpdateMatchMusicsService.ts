import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
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
        youtubeLink,
        title,
        operation,
    }: UpdateMatchMusicsPayload): Promise<CampaignInstance> {
        this.logger('info', 'UpdateMatchMusics - UpdateMatchMusicsService');
        const campaign = await this.campaignsRepository.findOne({ campaignId });

        if (operation === 'add' && campaign.matchData) {
            const musicWithSameLinkExists = campaign.matchData.musics.find(
                (music) => music.youtubeLink === youtubeLink
            );

            if (musicWithSameLinkExists) HttpRequestErrors.throwError('music-link-already-added');

            campaign.matchData.musics.push({
                title,
                youtubeLink,
            });
        }

        if (operation === 'remove' && campaign.matchData)
            campaign.matchData.musics = campaign.matchData.musics.filter((musics) => musics.title !== title);

        return campaign;
    }

    async save(campaign: CampaignInstance): Promise<CampaignInstance> {
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}

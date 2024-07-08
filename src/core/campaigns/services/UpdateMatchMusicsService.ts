import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { UpdateMatchMusicsPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateMatchMusicsService {
    private readonly _campaignsRepository;
    private readonly _logger;

    constructor({
        campaignsRepository,
        logger,
    }: CampaignCoreDependencies['updateMatchMusicsServiceContract']) {
        this._campaignsRepository = campaignsRepository;
        this._logger = logger;
    }

    async updateMatchMusics({
        campaignId,
        youtubeLink,
        title,
        operation,
    }: UpdateMatchMusicsPayload): Promise<CampaignInstance> {
        this._logger('info', 'UpdateMatchMusics - UpdateMatchMusicsService');
        const campaign = await this._campaignsRepository.findOne({ campaignId });

        if (operation === 'add' && campaign.matchData) {
            const musicWithSameLinkExists = campaign.matchData.musics.find(
                (music) => music.youtubeLink === youtubeLink
            );

            if (musicWithSameLinkExists)
                HttpRequestErrors.throwError('music-link-already-added');

            campaign.matchData.musics.push({
                title,
                youtubeLink,
            });
        }

        if (operation === 'remove' && campaign.matchData)
            campaign.matchData.musics = campaign.matchData.musics.filter(
                (musics) => musics.title !== title
            );

        return campaign;
    }

    async save(campaign: CampaignInstance): Promise<CampaignInstance> {
        const savedCampaign = await this._campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });

        return savedCampaign;
    }
}

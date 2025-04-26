import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { updateMatchDatePayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class updateMatchDateService {
    private readonly _campaignsRepository;
    private readonly _logger;

    constructor({
        campaignsRepository,
        logger,
    }: CampaignCoreDependencies['updateMatchDateServiceContract']) {
        this._campaignsRepository = campaignsRepository;
        this._logger = logger;
    }

    async updateMatchDate({
        campaignId,
        date,
        operation,
    }: updateMatchDatePayload): Promise<CampaignInstance> {
        this._logger('info', 'updateMatchDate - updateMatchDateService');
        const campaign = await this._campaignsRepository.findOne({ campaignId });

        if (operation === 'add') {
            const dateExist = campaign.infos.nextMatchDate;

            if (dateExist !== 'no-date')
                HttpRequestErrors.throwError('date-already-added');

            campaign.infos.nextMatchDate = date;
        }

        if (operation === 'remove') campaign.infos.nextMatchDate = 'no-date';

        return campaign;
    }

    async save(campaign: CampaignInstance): Promise<CampaignInstance> {
        return this._campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}

import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { UpdateMatchDatesPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateMatchDatesService {
    private readonly _campaignsRepository;
    private readonly _logger;

    constructor({
        campaignsRepository,
        logger,
    }: CampaignCoreDependencies['updateMatchDatesServiceContract']) {
        this._campaignsRepository = campaignsRepository;
        this._logger = logger;
    }

    async updateMatchDates({
        campaignId,
        date,
        operation,
    }: UpdateMatchDatesPayload): Promise<CampaignInstance> {
        this._logger('info', 'UpdateMatchDates - UpdateMatchDatesService');
        const campaign = await this._campaignsRepository.findOne({ campaignId });

        if (operation === 'add') {
            const dateExist = campaign.infos.matchDates.find((dbDate) => dbDate === date);

            if (dateExist) HttpRequestErrors.throwError('date-already-added');

            campaign.infos.matchDates.push(date);
        }

        if (operation === 'remove')
            campaign.infos.matchDates = campaign.infos.matchDates.filter(
                (dbDate) => dbDate !== date
            );

        return campaign;
    }

    async save(campaign: CampaignInstance): Promise<CampaignInstance> {
        return this._campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}

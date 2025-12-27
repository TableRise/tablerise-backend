import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { updateMatchDatePayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class updateMatchDateService {
    private readonly campaignsRepository;
    private readonly logger;

    constructor({ campaignsRepository, logger }: CampaignCoreDependencies['updateMatchDateServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;
    }

    async updateMatchDate({ campaignId, date, operation }: updateMatchDatePayload): Promise<CampaignInstance> {
        this.logger('info', 'updateMatchDate - updateMatchDateService');
        const campaign = await this.campaignsRepository.findOne({ campaignId });

        if (operation === 'add') {
            const dateExist = campaign.infos.nextMatchDate;

            if (dateExist !== 'no-date') HttpRequestErrors.throwError('date-already-added');

            campaign.infos.nextMatchDate = date;
        }

        if (operation === 'remove') campaign.infos.nextMatchDate = 'no-date';

        return campaign;
    }

    async save(campaign: CampaignInstance): Promise<CampaignInstance> {
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}

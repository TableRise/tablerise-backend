import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { AddMatchDatePayload, RemoveMatchDatePayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class updateMatchDateService {
    private readonly campaignsRepository;
    private readonly logger;

    constructor({ campaignsRepository, logger }: CampaignCoreDependencies['updateMatchDateServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;
    }

    async addMatchDate({ campaignId, date }: AddMatchDatePayload): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.addMatchDate.name}`;
        this.logger('info', callName);
        const campaign = await this.campaignsRepository.findOne({ campaignId });
        const dateExist = campaign.infos.nextMatchDate;

        if (dateExist !== 'no-date') HttpRequestErrors.throwError('date-already-added');

        campaign.infos.nextMatchDate = date;

        return campaign;
    }

    async removeMatchDate({ campaignId }: RemoveMatchDatePayload): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.removeMatchDate.name}`;
        this.logger('info', callName);
        const campaign = await this.campaignsRepository.findOne({ campaignId });
        campaign.infos.nextMatchDate = 'no-date';

        return campaign;
    }

    async save(campaign: Campaign): Promise<Campaign> {
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}

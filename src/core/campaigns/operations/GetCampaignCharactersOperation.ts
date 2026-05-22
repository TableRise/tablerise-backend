import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class GetCampaignCharactersOperation {
    private readonly getCampaignCharactersService;
    private readonly logger;

    constructor({
        getCampaignCharactersService,
        logger,
    }: CampaignCoreDependencies['getCampaignCharactersOperationContract']) {
        this.getCampaignCharactersService = getCampaignCharactersService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(campaignId: string): Promise<CharactersDnd[]> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        return this.getCampaignCharactersService.get(campaignId);
    }
}

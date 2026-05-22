import { CharacterToPlayerRecover } from 'src/types/api/characters/http/response';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class GetCharactersByPlayerOperation {
    private readonly getCharactersByPlayerService;
    private readonly logger;

    constructor({
        getCharactersByPlayerService,
        logger,
    }: CampaignCoreDependencies['getCharactersByPlayerOperationContract']) {
        this.getCharactersByPlayerService = getCharactersByPlayerService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(campaignId: string, userId: string): Promise<CharacterToPlayerRecover[]> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        console.log(userId);
        return this.getCharactersByPlayerService.get(campaignId, userId);
    }
}

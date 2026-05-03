import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class GetCampaignCharactersService {
    private readonly charactersRepository;
    private readonly logger;

    constructor({ charactersRepository, logger }: CampaignCoreDependencies['getCampaignCharactersServiceContract']) {
        this.charactersRepository = charactersRepository;
        this.logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(campaignId: string): Promise<CharactersDnd[]> {
        this.logger('info', 'Get - GetCampaignCharactersService');
        return this.charactersRepository.find({ campaignId });
    }
}

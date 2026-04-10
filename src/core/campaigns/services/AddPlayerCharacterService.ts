import Campaign, { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { addCharacterPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class AddPlayerCharacterService {
    private readonly campaignsRepository;
    private readonly charactersRepository;
    private readonly logger;

    constructor({
        campaignsRepository,
        charactersRepository,
        logger,
    }: CampaignCoreDependencies['addPlayerCharacterServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.charactersRepository = charactersRepository;
        this.logger = logger;

        this.addCharacter = this.addCharacter.bind(this);
        this.save = this.save.bind(this);
    }

    public async addCharacter({ characterId, userId, campaignId }: addCharacterPayload): Promise<Campaign> {
        this.logger('info', 'AddCharacter - AddPlayerCharacterService');
        const campaignInDb = await this.campaignsRepository.findOne({ campaignId });
        const playerIncampaignIndex = campaignInDb.campaignPlayers.findIndex(
            (player: Player) => player.userId === userId
        );

        if (playerIncampaignIndex === -1) HttpRequestErrors.throwError('campaign-player-not-exists');

        campaignInDb.campaignPlayers[playerIncampaignIndex].characterIds.push(characterId);

        await this.charactersRepository.update({
            query: { characterId },
            payload: { campaignId: campaignInDb.campaignId },
        });

        return campaignInDb;
    }

    public async save(payload: Campaign): Promise<Campaign> {
        this.logger('info', 'Save - AddPlayerCharacterService');
        return this.campaignsRepository.update({
            query: { campaignId: payload.campaignId },
            payload,
        });
    }
}

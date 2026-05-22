import Campaign, { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { addCharacterPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class RemovePlayerCharacterService {
    private readonly campaignsRepository;
    private readonly charactersRepository;
    private readonly logger;

    constructor({
        campaignsRepository,
        charactersRepository,
        logger,
    }: CampaignCoreDependencies['removePlayerCharacterServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.charactersRepository = charactersRepository;
        this.logger = logger;

        this.removeCharacter = this.removeCharacter.bind(this);
        this.save = this.save.bind(this);
    }

    public async removeCharacter({ characterId, campaignId }: addCharacterPayload): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.removeCharacter.name}`;
        this.logger('info', callName);
        const campaignInDb = await this.campaignsRepository.findOne({ campaignId });

        const playerInCampaignIndex = campaignInDb.campaignPlayers.findIndex((player: Player) =>
            player.characterIds.includes(characterId)
        );

        campaignInDb.campaignPlayers[playerInCampaignIndex].characterIds = campaignInDb.campaignPlayers[
            playerInCampaignIndex
        ].characterIds.filter((id: string) => id !== characterId);

        await this.charactersRepository.update({
            query: { characterId },
            payload: { campaignId: null },
        });

        return campaignInDb;
    }

    public async save(payload: Campaign): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.save.name}`;
        this.logger('info', callName);
        return this.campaignsRepository.update({
            query: { campaignId: payload.campaignId },
            payload,
        });
    }
}

import Campaign, { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
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
        this.logger('info', 'RemoveCharacter - RemovePlayerCharacterService');
        const campaignInDb = await this.campaignsRepository.findOne({ campaignId });
        const characterInDb = await this.charactersRepository.findOne({ characterId });

        const playerInCampaignIndex = campaignInDb.campaignPlayers.findIndex(
            (player: Player) => player.userId === characterInDb.author.userId
        );

        if (playerInCampaignIndex === -1) HttpRequestErrors.throwError('campaign-player-not-exists');

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
        this.logger('info', 'Save - RemovePlayerCharacterService');
        return this.campaignsRepository.update({
            query: { campaignId: payload.campaignId },
            payload,
        });
    }
}

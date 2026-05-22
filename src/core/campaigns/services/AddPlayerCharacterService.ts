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

    public async addCharacter({ characterId, campaignId }: addCharacterPayload): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.addCharacter.name}`;
        this.logger('info', callName);
        const campaignInDb = await this.campaignsRepository.findOne({ campaignId });
        const characterInDb = await this.charactersRepository.findOne({ characterId });

        const playerIncampaignIndex = campaignInDb.campaignPlayers.findIndex(
            (player: Player) => player.userId === characterInDb.author.userId
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
        const callName = `[${this.constructor.name}] - ${this.save.name}`;
        this.logger('info', callName);
        return this.campaignsRepository.update({
            query: { campaignId: payload.campaignId },
            payload,
        });
    }
}

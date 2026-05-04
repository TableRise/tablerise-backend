import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { CharacterToPlayerRecover } from 'src/types/api/characters/http/response';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class GetCharactersByPlayerService {
    private readonly campaignsRepository;
    private readonly charactersRepository;
    private readonly logger;

    constructor({
        campaignsRepository,
        charactersRepository,
        logger,
    }: CampaignCoreDependencies['getCharactersByPlayerServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.charactersRepository = charactersRepository;
        this.logger = logger;

        this.get = this.get.bind(this);
    }

    private mapCharacters(characters: CharactersDnd[]): CharacterToPlayerRecover[] {
        return characters.map((char) => ({
            characterId: char.characterId,
            author: char.author,
            picture: char.picture,
            profile: char.data.profile,
            createdAt: char.data.createdAt,
            updatedAt: char.data.updatedAt,
        }));
    }

    public async get(campaignId: string, userId: string): Promise<CharacterToPlayerRecover[]> {
        this.logger('info', 'Get - GetCharactersByPlayerService');

        const campaignInDb = await this.campaignsRepository.findOne({ campaignId });
        const player = campaignInDb.campaignPlayers.find((p) => p.userId === userId);

        if (!player) HttpRequestErrors.throwError('campaign-player-not-exists');

        const characters = await Promise.all(
            player.characterIds.map(async (characterId) => this.charactersRepository.findOne({ characterId }))
        );

        return this.mapCharacters(characters);
    }
}

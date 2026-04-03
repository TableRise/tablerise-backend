import { CharactersDnd, Profile } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { GetCharacterByCampaignPayload } from 'src/types/api/characters/http/payload';
import { CharacterToPlayerRecover } from 'src/types/api/characters/http/response';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class RecoverCharacterByCampaignService {
    private readonly charactersRepository;
    private readonly campaignsRepository;
    private readonly logger;

    constructor({
        charactersRepository,
        campaignsRepository,
        logger,
    }: CharacterCoreDependencies['recoverCharacterByCampaignServiceContract']) {
        this.charactersRepository = charactersRepository;
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;

        this.recoverByCampaign = this.recoverByCampaign.bind(this);
    }

    private mapCharactersForPlayer(characters: CharactersDnd[]): CharacterToPlayerRecover[] {
        return characters.map((char) => {
            return {
                characterId: char.characterId as string,
                author: char.author,
                picture: char.picture as ImageObject,
                profile: char.data.profile as Profile,
            };
        });
    }

    private async getCharacters(campaign: Campaign): Promise<CharactersDnd[]> {
        const charactersArrays = campaign.campaignPlayers.map((camPlayer) => camPlayer.characterIds);
        const charactersIds = [] as string[];
        const characters = [] as Array<Promise<CharactersDnd>>;

        charactersArrays.forEach((charIds) => {
            charIds.forEach((charUniqIds) => {
                charactersIds.push(charUniqIds);
            });
        });

        charactersIds.forEach((charId) => {
            const character = this.charactersRepository.findOne({ characterId: charId });
            characters.push(character);
        });

        return Promise.all(characters);
    }

    public async recoverByCampaign({
        userId,
        campaignId,
    }: GetCharacterByCampaignPayload): Promise<CharactersDnd[] | CharacterToPlayerRecover[]> {
        this.logger('info', 'RecoverCharacterByCampaignService - Execute');

        const campaignInDb = await this.campaignsRepository.findOne({ campaignId });
        const playerInCampaign = campaignInDb.campaignPlayers.find((player) => player.userId === userId);

        const getCharacters = await this.getCharacters(campaignInDb);

        const getCharactersResolved = await Promise.all(getCharacters);

        if (!playerInCampaign) HttpRequestErrors.throwError('campaign-player-not-exists');

        if (playerInCampaign.role === 'player') return this.mapCharactersForPlayer(getCharactersResolved);

        return getCharactersResolved;
    }
}

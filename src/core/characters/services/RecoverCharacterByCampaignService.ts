import { Profile } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { GetCharacterByCampaignPayload } from 'src/types/api/characters/http/payload';
import { CharacterToPlayerRecover } from 'src/types/api/characters/http/response';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class RecoverCharacterByCampaignService {
    private readonly _charactersRepository;
    private readonly _campaignsRepository;
    private readonly _logger;

    constructor({
        charactersRepository,
        campaignsRepository,
        logger,
    }: CharacterCoreDependencies['recoverCharacterByCampaignServiceContract']) {
        this._charactersRepository = charactersRepository;
        this._campaignsRepository = campaignsRepository;
        this._logger = logger;

        this.recoverByCampaign = this.recoverByCampaign.bind(this);
    }

    private _mapCharactersForPlayer(
        characters: CharacterInstance[]
    ): CharacterToPlayerRecover[] {
        return characters.map((char) => {
            return {
                characterId: char.characterId as string,
                author: char.author,
                picture: char.picture as ImageObject,
                profile: char.data.profile as Profile,
            };
        });
    }

    private async _getCharacters(
        campaign: CampaignInstance
    ): Promise<CharacterInstance[]> {
        const charactersArrays = campaign.campaignPlayers.map(
            (camPlayer) => camPlayer.characterIds
        );
        const charactersIds = [] as string[];
        const characters = [] as Array<Promise<CharacterInstance>>;

        charactersArrays.forEach((charIds) => {
            charIds.forEach((charUniqIds) => {
                charactersIds.push(charUniqIds);
            });
        });

        charactersIds.forEach((charId) => {
            const character = this._charactersRepository.findOne({ characterId: charId });
            characters.push(character);
        });

        return Promise.all(characters);
    }

    public async recoverByCampaign({
        userId,
        campaignId,
    }: GetCharacterByCampaignPayload): Promise<
        CharacterInstance[] | CharacterToPlayerRecover[]
    > {
        this._logger('info', 'RecoverCharacterByCampaignService - Execute');

        const campaignInDb = await this._campaignsRepository.findOne({ campaignId });
        const playerInCampaign = campaignInDb.campaignPlayers.find(
            (player) => player.userId === userId
        );

        const getCharacters = await this._getCharacters(campaignInDb);

        const getCharactersResolved = await Promise.all(getCharacters);

        if (!playerInCampaign) HttpRequestErrors.throwError('campaign-player-not-exists');

        if (playerInCampaign.role === 'player')
            return this._mapCharactersForPlayer(getCharactersResolved);

        return getCharactersResolved;
    }
}

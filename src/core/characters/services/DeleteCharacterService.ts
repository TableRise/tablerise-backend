import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { DeleteCharacterPayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class DeleteCharacterService {
    private readonly charactersRepository;
    private readonly usersDetailsRepository;
    private readonly campaignsRepository;
    private readonly logger;

    constructor({
        charactersRepository,
        usersDetailsRepository,
        campaignsRepository,
        logger,
    }: CharacterCoreDependencies['deleteCharacterServiceContract']) {
        this.charactersRepository = charactersRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;

        this.delete = this.delete.bind(this);
    }

    public async delete({ characterId, userId }: DeleteCharacterPayload): Promise<Campaign | null> {
        const callName = `[${this.constructor.name}] - ${this.delete.name}`;
        this.logger('info', callName);

        const characterInDb = await this.charactersRepository.findOne({ characterId });

        if (characterInDb.author.userId !== userId) {
            HttpRequestErrors.throwError('forbidden-role-operation');
        }

        const ownerDetails = await this.usersDetailsRepository.findOne({ userId });
        if (!ownerDetails) HttpRequestErrors.throwError('user-inexistent');

        ownerDetails.gameInfo.characters = ownerDetails.gameInfo.characters.filter((id: string) => id !== characterId);

        await this.usersDetailsRepository.update({
            query: { userId },
            payload: ownerDetails,
        });

        let savedCampaign: Campaign | null = null;

        if (characterInDb.campaignId) {
            const campaignInDb = await this.campaignsRepository.findOne({ campaignId: characterInDb.campaignId });

            campaignInDb.campaignPlayers = campaignInDb.campaignPlayers.map((player) => ({
                ...player,
                characterIds: player.characterIds.filter((id: string) => id !== characterId),
            }));

            savedCampaign = await this.campaignsRepository.update({
                query: { campaignId: campaignInDb.campaignId },
                payload: campaignInDb,
            });
        }

        await this.charactersRepository.delete({ characterId });

        return savedCampaign;
    }
}

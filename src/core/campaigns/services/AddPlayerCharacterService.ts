import { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { addCharacterPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class AddPlayerCharacterService {
    private readonly _campaignsRepository;
    private readonly _logger;

    constructor({
        campaignsRepository,
        logger,
    }: CampaignCoreDependencies['addPlayerCharacterServiceContract']) {
        this._campaignsRepository = campaignsRepository;
        this._logger = logger;

        this.addCharacter = this.addCharacter.bind(this);
        this.save = this.save.bind(this);
    }

    public async addCharacter({
        characterId,
        userId,
        campaignId,
    }: addCharacterPayload): Promise<CampaignInstance> {
        const campaignInDb = await this._campaignsRepository.findOne({ campaignId });
        const playerIncampaignIndex = campaignInDb.campaignPlayers.findIndex(
            (player: Player) => player.userId === userId
        );

        if (playerIncampaignIndex === -1)
            HttpRequestErrors.throwError('campaign-player-not-exists');

        campaignInDb.campaignPlayers[playerIncampaignIndex].characterIds.push(
            characterId
        );

        return campaignInDb;
    }

    public async save(payload: CampaignInstance): Promise<CampaignInstance> {
        return this._campaignsRepository.update({
            query: { campaignId: payload.campaignId },
            payload,
        });
    }
}

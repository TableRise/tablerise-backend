import { Monster } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleMonstersAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/monsters/ToggleMonstersAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleMonstersAvailabilityOperation {
    private readonly _toggleMonstersAvailabilityService;
    private readonly _logger;

    constructor({
        toggleMonstersAvailabilityService,
        logger,
    }: ToggleMonstersAvailabilityOperationContract) {
        this._toggleMonstersAvailabilityService = toggleMonstersAvailabilityService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({
        id,
        availability,
    }: AvailabilityPayload): Promise<Internacional<Monster>> {
        this._logger('info', 'Execute - GetMonsterOperation');
        const monsters = await this._toggleMonstersAvailabilityService.toggle({
            id,
            availability,
        });
        return monsters;
    }
}

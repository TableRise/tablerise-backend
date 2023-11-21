import { Armor } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { ToggleWeaponsAvailabilityOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/weapons/ToggleWeaponsAvailability';
import { AvailabilityPayload } from 'src/types/dungeons&dragons5e/requests/Payload';

export default class ToggleWeaponsAvailabilityOperation {
    private readonly _toggleWeaponsAvailabilityService;
    private readonly _logger;

    constructor({
        toggleWeaponsAvailabilityService,
        logger,
    }: ToggleWeaponsAvailabilityOperationContract) {
        this._toggleWeaponsAvailabilityService = toggleWeaponsAvailabilityService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({
        id,
        availability,
    }: AvailabilityPayload): Promise<Internacional<Armor>> {
        this._logger('info', 'Execute - GetArmorOperation');
        const weapons = await this._toggleWeaponsAvailabilityService.toggle({
            id,
            availability,
        });
        return weapons;
    }
}

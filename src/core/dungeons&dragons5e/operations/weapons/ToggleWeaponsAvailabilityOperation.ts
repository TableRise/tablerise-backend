import { Weapon } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleWeaponsAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/weapons/ToggleWeaponsAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

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
    }: AvailabilityPayload): Promise<Internacional<Weapon>> {
        this._logger('info', 'Execute - ToggleWeaponsAvailabilityOperation');
        const weapons = await this._toggleWeaponsAvailabilityService.toggle({
            id,
            availability,
        });
        return weapons;
    }
}

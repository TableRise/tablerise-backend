import { Weapon } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleWeaponsAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/weapons/ToggleWeaponsAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleWeaponsAvailabilityOperation {
    private readonly toggleWeaponsAvailabilityService;
    private readonly logger;

    constructor({ toggleWeaponsAvailabilityService, logger }: ToggleWeaponsAvailabilityOperationContract) {
        this.toggleWeaponsAvailabilityService = toggleWeaponsAvailabilityService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ id, availability }: AvailabilityPayload): Promise<Internacional<Weapon>> {
        this.logger('info', 'Execute - ToggleWeaponsAvailabilityOperation');
        const weapons = await this.toggleWeaponsAvailabilityService.toggle({
            id,
            availability,
        });
        return weapons;
    }
}

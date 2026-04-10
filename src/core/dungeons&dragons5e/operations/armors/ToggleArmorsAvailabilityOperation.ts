import { Armor } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleArmorsAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/armors/ToggleArmorsAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleArmorsAvailabilityOperation {
    private readonly toggleArmorsAvailabilityService;
    private readonly logger;

    constructor({ toggleArmorsAvailabilityService, logger }: ToggleArmorsAvailabilityOperationContract) {
        this.toggleArmorsAvailabilityService = toggleArmorsAvailabilityService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ id, availability }: AvailabilityPayload): Promise<Internacional<Armor>> {
        this.logger('info', 'Execute - GetArmorOperation');
        const armors = await this.toggleArmorsAvailabilityService.toggle({
            id,
            availability,
        });
        return armors;
    }
}

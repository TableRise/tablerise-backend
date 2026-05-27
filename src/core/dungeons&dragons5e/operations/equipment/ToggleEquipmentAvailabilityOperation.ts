import { Equipment } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { ToggleEquipmentAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/equipment/ToggleEquipmentAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleEquipmentAvailabilityOperation {
    private readonly toggleEquipmentAvailabilityService;
    private readonly logger;

    constructor({ toggleEquipmentAvailabilityService, logger }: ToggleEquipmentAvailabilityOperationContract) {
        this.toggleEquipmentAvailabilityService = toggleEquipmentAvailabilityService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ id, availability }: AvailabilityPayload): Promise<Equipment> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        const equipment = await this.toggleEquipmentAvailabilityService.toggle({
            id,
            availability,
        });

        return equipment;
    }
}

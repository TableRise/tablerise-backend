import { Equipment } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { ToggleEquipmentAvailabilityServiceContract } from 'src/types/modules/core/dungeons&dragons5e/equipment/ToggleEquipmentAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleEquipmentAvailabilityService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: ToggleEquipmentAvailabilityServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({ id, availability }: AvailabilityPayload): Promise<Equipment> {
        this.logger('info', 'Toggle - ToggleEquipmentAvailabilityService');
        this.dungeonsAndDragonsRepository.setEntity('Equipment' as any);

        const equipmentInDb = (await this.dungeonsAndDragonsRepository.findOne({
            equipmentId: id,
        })) as Equipment & { active: boolean };

        equipmentInDb.active = availability;

        await this.dungeonsAndDragonsRepository.update({
            query: { equipmentId: id },
            payload: equipmentInDb,
        });

        return equipmentInDb;
    }
}

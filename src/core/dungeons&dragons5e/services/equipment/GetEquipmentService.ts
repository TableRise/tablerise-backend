import { Equipment } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { GetEquipmentServiceContract } from 'src/types/modules/core/dungeons&dragons5e/equipment/GetEquipment';

export default class GetEquipmentService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetEquipmentServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Equipment> {
        this.logger('info', 'Get - GetEquipmentService');
        this.dungeonsAndDragonsRepository.setEntity('Equipment' as any);

        const equipmentInDb = (await this.dungeonsAndDragonsRepository.findOne({
            equipmentId: id,
        })) as Equipment;

        return equipmentInDb;
    }
}

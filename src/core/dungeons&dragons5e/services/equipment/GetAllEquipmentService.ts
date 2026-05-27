import { Equipment } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { GetAllEquipmentServiceContract } from 'src/types/modules/core/dungeons&dragons5e/equipment/GetAllEquipment';

export default class GetAllEquipmentService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllEquipmentServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Equipment[]> {
        const callName = `[${this.constructor.name}] - ${this.getAll.name}`;
        this.logger('info', callName);
        this.dungeonsAndDragonsRepository.setEntity('Equipment' as any);

        const equipmentInDb = (await this.dungeonsAndDragonsRepository.find({
            active: true,
        })) as Equipment[];

        return equipmentInDb;
    }
}

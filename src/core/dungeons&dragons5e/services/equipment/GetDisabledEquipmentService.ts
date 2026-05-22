import { Equipment } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { GetDisabledEquipmentServiceContract } from 'src/types/modules/core/dungeons&dragons5e/equipment/GetDisabledEquipment';

export default class GetDisabledEquipmentService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetDisabledEquipmentServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Equipment[]> {
        const callName = `[${this.constructor.name}] - ${this.getAllDisabled.name}`;
        this.logger('info', callName);
        this.dungeonsAndDragonsRepository.setEntity('Equipment' as any);

        const equipmentInDb = (await this.dungeonsAndDragonsRepository.find({
            active: false,
        })) as Equipment[];

        return equipmentInDb;
    }
}

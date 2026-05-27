import { Equipment } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { GetAllEquipmentOperationContract } from 'src/types/modules/core/dungeons&dragons5e/equipment/GetAllEquipment';

export default class GetAllEquipmentOperation {
    private readonly getAllEquipmentService;
    private readonly logger;

    constructor({ getAllEquipmentService, logger }: GetAllEquipmentOperationContract) {
        this.getAllEquipmentService = getAllEquipmentService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Equipment[]> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        const equipment = await this.getAllEquipmentService.getAll();

        return equipment;
    }
}

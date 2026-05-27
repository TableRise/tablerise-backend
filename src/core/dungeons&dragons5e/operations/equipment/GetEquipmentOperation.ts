import { Equipment } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { GetEquipmentOperationContract } from 'src/types/modules/core/dungeons&dragons5e/equipment/GetEquipment';

export default class GetEquipmentOperation {
    private readonly getEquipmentService;
    private readonly logger;

    constructor({ getEquipmentService, logger }: GetEquipmentOperationContract) {
        this.getEquipmentService = getEquipmentService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Equipment> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        const equipment = await this.getEquipmentService.get(id);

        return equipment;
    }
}

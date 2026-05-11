import { Equipment } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { GetDisabledEquipmentOperationContract } from 'src/types/modules/core/dungeons&dragons5e/equipment/GetDisabledEquipment';

export default class GetDisabledEquipmentOperation {
    private readonly getDisabledEquipmentService;
    private readonly logger;

    constructor({ getDisabledEquipmentService, logger }: GetDisabledEquipmentOperationContract) {
        this.getDisabledEquipmentService = getDisabledEquipmentService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Equipment[]> {
        this.logger('info', 'Execute - GetDisabledEquipmentOperation');
        const equipment = await this.getDisabledEquipmentService.getAllDisabled();

        return equipment;
    }
}

import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import { ManageEquipmentPayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class AddEquipmentOperation {
    private readonly addEquipmentService;
    private readonly logger;

    constructor({ addEquipmentService, logger }: CharacterCoreDependencies['addEquipmentOperationContract']) {
        this.addEquipmentService = addEquipmentService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute({ characterId, equipmentId }: ManageEquipmentPayload): Promise<CharactersDnd> {
        this.logger('info', 'AddEquipmentOperation - Execute');
        return this.addEquipmentService.add({ characterId, equipmentId });
    }
}

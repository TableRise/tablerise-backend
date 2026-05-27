import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import { ManageEquipmentPayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class RemoveEquipmentOperation {
    private readonly removeEquipmentService;
    private readonly logger;

    constructor({ removeEquipmentService, logger }: CharacterCoreDependencies['removeEquipmentOperationContract']) {
        this.removeEquipmentService = removeEquipmentService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute({ characterId, equipmentId }: ManageEquipmentPayload): Promise<CharactersDnd> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        return this.removeEquipmentService.remove({ characterId, equipmentId });
    }
}

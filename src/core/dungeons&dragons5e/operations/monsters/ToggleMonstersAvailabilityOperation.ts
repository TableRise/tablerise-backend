import { Monster } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleMonstersAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/monsters/ToggleMonstersAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleMonstersAvailabilityOperation {
    private readonly toggleMonstersAvailabilityService;
    private readonly logger;

    constructor({ toggleMonstersAvailabilityService, logger }: ToggleMonstersAvailabilityOperationContract) {
        this.toggleMonstersAvailabilityService = toggleMonstersAvailabilityService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ id, availability }: AvailabilityPayload): Promise<Internacional<Monster>> {
        this.logger('info', 'Execute - GetMonsterOperation');
        const monsters = await this.toggleMonstersAvailabilityService.toggle({
            id,
            availability,
        });
        return monsters;
    }
}

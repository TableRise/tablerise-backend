import { God } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleGodsAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/gods/ToggleGodsAvailabilityOperation';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleGodsAvailabilityOperation {
    private readonly toggleGodsAvailabilityService;
    private readonly logger;

    constructor({ toggleGodsAvailabilityService, logger }: ToggleGodsAvailabilityOperationContract) {
        this.toggleGodsAvailabilityService = toggleGodsAvailabilityService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ id, availability }: AvailabilityPayload): Promise<Internacional<God>> {
        this.logger('info', 'Execute - GetGodOperation');
        const gods = await this.toggleGodsAvailabilityService.toggle({
            id,
            availability,
        });
        return gods;
    }
}

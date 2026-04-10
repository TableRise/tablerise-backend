import { Background } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleBackgroundsAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/backgrounds/ToggleBackgroundsAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleBackgroundsAvailabilityOperation {
    private readonly toggleBackgroundsAvailabilityService;
    private readonly logger;

    constructor({ toggleBackgroundsAvailabilityService, logger }: ToggleBackgroundsAvailabilityOperationContract) {
        this.toggleBackgroundsAvailabilityService = toggleBackgroundsAvailabilityService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ id, availability }: AvailabilityPayload): Promise<Internacional<Background>> {
        this.logger('info', 'Execute - GetBackgroundOperation');
        const backgrounds = await this.toggleBackgroundsAvailabilityService.toggle({
            id,
            availability,
        });
        return backgrounds;
    }
}

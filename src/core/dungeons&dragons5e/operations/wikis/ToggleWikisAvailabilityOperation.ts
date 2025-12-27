import { Wiki } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleWikisAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/wikis/ToggleWikisAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleWikisAvailabilityOperation {
    private readonly toggleWikisAvailabilityService;
    private readonly logger;

    constructor({ toggleWikisAvailabilityService, logger }: ToggleWikisAvailabilityOperationContract) {
        this.toggleWikisAvailabilityService = toggleWikisAvailabilityService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ id, availability }: AvailabilityPayload): Promise<Internacional<Wiki>> {
        this.logger('info', 'Execute - ToggleWikisAvailabilityOperation');
        const wikis = await this.toggleWikisAvailabilityService.toggle({
            id,
            availability,
        });
        return wikis;
    }
}

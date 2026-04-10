import { Realm } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleRealmsAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/realms/ToggleRealmsAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleRealmsAvailabilityOperation {
    private readonly toggleRealmsAvailabilityService;
    private readonly logger;

    constructor({ toggleRealmsAvailabilityService, logger }: ToggleRealmsAvailabilityOperationContract) {
        this.toggleRealmsAvailabilityService = toggleRealmsAvailabilityService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ id, availability }: AvailabilityPayload): Promise<Internacional<Realm>> {
        this.logger('info', 'Execute - ToggleRealmsAvailabilityOperation');
        const realms = await this.toggleRealmsAvailabilityService.toggle({
            id,
            availability,
        });

        return realms;
    }
}

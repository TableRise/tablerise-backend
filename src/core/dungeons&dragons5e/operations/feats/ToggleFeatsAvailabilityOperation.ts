import { Feat } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleFeatsAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/feats/ToggleFeatsAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleFeatsAvailabilityOperation {
    private readonly toggleFeatsAvailabilityService;
    private readonly logger;

    constructor({ toggleFeatsAvailabilityService, logger }: ToggleFeatsAvailabilityOperationContract) {
        this.toggleFeatsAvailabilityService = toggleFeatsAvailabilityService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ id, availability }: AvailabilityPayload): Promise<Internacional<Feat>> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        const feats = await this.toggleFeatsAvailabilityService.toggle({
            id,
            availability,
        });
        return feats;
    }
}

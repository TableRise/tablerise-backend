import { Race } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleRacesAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/races/ToggleRacesAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleRacesAvailabilityOperation {
    private readonly toggleRacesAvailabilityService;
    private readonly logger;

    constructor({ toggleRacesAvailabilityService, logger }: ToggleRacesAvailabilityOperationContract) {
        this.toggleRacesAvailabilityService = toggleRacesAvailabilityService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ id, availability }: AvailabilityPayload): Promise<Internacional<Race>> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        const races = await this.toggleRacesAvailabilityService.toggle({
            id,
            availability,
        });

        return races;
    }
}

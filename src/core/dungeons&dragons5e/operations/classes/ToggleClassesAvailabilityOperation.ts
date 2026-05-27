import { Class } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleClassesAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/classes/ToggleClassesAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleClassesAvailabilityOperation {
    private readonly toggleClassesAvailabilityService;
    private readonly logger;

    constructor({ toggleClassesAvailabilityService, logger }: ToggleClassesAvailabilityOperationContract) {
        this.toggleClassesAvailabilityService = toggleClassesAvailabilityService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ id, availability }: AvailabilityPayload): Promise<Internacional<Class>> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        const classes = await this.toggleClassesAvailabilityService.toggle({
            id,
            availability,
        });
        return classes;
    }
}

import { Class } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleClassesAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/classes/ToggleClassesAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleClassesAvailabilityOperation {
    private readonly _toggleClassesAvailabilityService;
    private readonly _logger;

    constructor({
        toggleClassesAvailabilityService,
        logger,
    }: ToggleClassesAvailabilityOperationContract) {
        this._toggleClassesAvailabilityService = toggleClassesAvailabilityService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({
        id,
        availability,
    }: AvailabilityPayload): Promise<Internacional<Class>> {
        this._logger('info', 'Execute - GetClassOperation');
        const classes = await this._toggleClassesAvailabilityService.toggle({
            id,
            availability,
        });
        return classes;
    }
}

import { Class } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { ToggleClassesAvailabilityServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/classes/ToggleClassesAvailability';
import { AvailabilityPayload } from 'src/types/dungeons&dragons5e/requests/Payload';

export default class ToggleClassesAvailabilityService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({
        dungeonsAndDragonsRepository,
        logger,
    }: ToggleClassesAvailabilityServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({
        id,
        availability,
    }: AvailabilityPayload): Promise<Internacional<Class>> {
        this._logger('info', 'Toggle - ToggleClassesAvailabilityService');
        this._dungeonsAndDragonsRepository.setEntity('Classes');

        const classInDb = (await this._dungeonsAndDragonsRepository.findOne({
            classId: id,
        })) as Internacional<Class>;

        classInDb.active = availability;

        await this._dungeonsAndDragonsRepository.update({
            query: { classId: id },
            payload: classInDb,
        });

        return classInDb;
    }
}

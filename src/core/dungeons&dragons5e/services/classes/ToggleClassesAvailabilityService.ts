import { Class } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleClassesAvailabilityServiceContract } from 'src/types/modules/core/dungeons&dragons5e/classes/ToggleClassesAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleClassesAvailabilityService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: ToggleClassesAvailabilityServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({ id, availability }: AvailabilityPayload): Promise<Internacional<Class>> {
        const callName = `[${this.constructor.name}] - ${this.toggle.name}`;
        this.logger('info', callName);
        this.dungeonsAndDragonsRepository.setEntity('Classes');

        const classInDb = (await this.dungeonsAndDragonsRepository.findOne({
            classId: id,
        })) as Internacional<Class>;

        classInDb.active = availability;

        await this.dungeonsAndDragonsRepository.update({
            query: { classId: id },
            payload: classInDb,
        });

        return classInDb;
    }
}

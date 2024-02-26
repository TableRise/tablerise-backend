import { Class } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledClassesServiceContract } from 'src/types/modules/core/dungeons&dragons5e/classes/GetDisabledClasses';

export default class GetDisabledClassesService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({
        dungeonsAndDragonsRepository,
        logger,
    }: GetDisabledClassesServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Array<Internacional<Class>>> {
        this._logger('info', 'GetAll - GetDisabledClassesService');
        this._dungeonsAndDragonsRepository.setEntity('Classes');

        const classInDb = (await this._dungeonsAndDragonsRepository.find({
            active: false,
        })) as Array<Internacional<Class>>;
        return classInDb;
    }
}

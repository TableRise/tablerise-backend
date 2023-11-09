import { Class } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { GetDisabledClassesServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/classes/GetDisabledClasses';

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

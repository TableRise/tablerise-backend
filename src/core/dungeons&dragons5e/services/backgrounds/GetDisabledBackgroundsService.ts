import { Background } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledBackgroundsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/backgrounds/GetDisabledBackgrounds';

export default class GetDisabledBackgroundsService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({
        dungeonsAndDragonsRepository,
        logger,
    }: GetDisabledBackgroundsServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Array<Internacional<Background>>> {
        this._logger('info', 'GetAll - GetDisabledBackgroundsService');
        this._dungeonsAndDragonsRepository.setEntity('Backgrounds');

        const backgroundInDb = (await this._dungeonsAndDragonsRepository.find({
            active: false,
        })) as Array<Internacional<Background>>;
        return backgroundInDb;
    }
}

import { Wiki } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { GetDisabledWikisServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/wikis/GetDisabledWikis';

export default class GetDisabledWikisService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({
        dungeonsAndDragonsRepository,
        logger,
    }: GetDisabledWikisServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Array<Internacional<Wiki>>> {
        this._logger('info', 'getAllDisabled - GetDisabledWikisService');
        this._dungeonsAndDragonsRepository.setEntity('Wikis');

        const wikisInDb = (await this._dungeonsAndDragonsRepository.find({
            active: false,
        })) as Array<Internacional<Wiki>>;

        return wikisInDb;
    }
}

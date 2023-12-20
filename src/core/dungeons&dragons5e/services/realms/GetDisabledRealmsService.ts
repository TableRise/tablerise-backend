import { Realm } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledRealmsServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/realms/GetDisabledRealms';

export default class GetDisabledRealmsService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({
        dungeonsAndDragonsRepository,
        logger,
    }: GetDisabledRealmsServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Array<Internacional<Realm>>> {
        this._logger('info', 'getAllDisabled - GetDisabledRealmsService');
        this._dungeonsAndDragonsRepository.setEntity('Realms');

        const realmsInDb = (await this._dungeonsAndDragonsRepository.find({
            active: false,
        })) as Array<Internacional<Realm>>;

        return realmsInDb;
    }
}

import { Realm } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllRealmsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/realms/GetAllRealms';

export default class GetAllRealmsService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllRealmsServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Array<Internacional<Realm>>> {
        this._logger('info', 'GetAll - GetAllRealmsService');
        this._dungeonsAndDragonsRepository.setEntity('Realms');

        const realmsInDb = (await this._dungeonsAndDragonsRepository.find({
            active: true,
        })) as Array<Internacional<Realm>>;

        return realmsInDb;
    }
}

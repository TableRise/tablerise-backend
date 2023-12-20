import { Realm } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllRealmsServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/realms/GetAllRealms';

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

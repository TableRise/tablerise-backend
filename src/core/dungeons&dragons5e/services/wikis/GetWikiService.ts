import { Wiki } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetWikiServiceContract } from 'src/types/modules/core/dungeons&dragons5e/wikis/GetWiki';

export default class GetWikiService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetWikiServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<Wiki>> {
        this._logger('info', 'Get - GetWikiService');
        this._dungeonsAndDragonsRepository.setEntity('Wikis');

        const wikiInDb = (await this._dungeonsAndDragonsRepository.findOne({
            wikiId: id,
        })) as Internacional<Wiki>;

        return wikiInDb;
    }
}

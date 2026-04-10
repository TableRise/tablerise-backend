import { Wiki } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetWikiServiceContract } from 'src/types/modules/core/dungeons&dragons5e/wikis/GetWiki';

export default class GetWikiService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetWikiServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<Wiki>> {
        this.logger('info', 'Get - GetWikiService');
        this.dungeonsAndDragonsRepository.setEntity('Wikis');

        const wikiInDb = (await this.dungeonsAndDragonsRepository.findOne({
            wikiId: id,
        })) as Internacional<Wiki>;

        return wikiInDb;
    }
}

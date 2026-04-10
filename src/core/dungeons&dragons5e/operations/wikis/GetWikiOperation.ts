import { Wiki } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetWikiOperationContract } from 'src/types/modules/core/dungeons&dragons5e/wikis/GetWiki';

export default class GetWikiOperation {
    private readonly getWikiService;
    private readonly logger;

    constructor({ getWikiService, logger }: GetWikiOperationContract) {
        this.getWikiService = getWikiService;
        this.logger = logger;
        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<Wiki>> {
        this.logger('info', 'Execute - GetWikiOperation');
        const wiki = await this.getWikiService.get(id);
        return wiki;
    }
}

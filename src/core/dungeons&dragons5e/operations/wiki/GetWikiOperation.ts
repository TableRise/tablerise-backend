import { Wiki } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { GetWikiOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/wikis/GetWiki';

export default class GetWikiOperation {
    private readonly _getWikiService;
    private readonly _logger;

    constructor({ getWikiService, logger }: GetWikiOperationContract) {
        this._getWikiService = getWikiService;
        this._logger = logger;
        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<Wiki>> {
        this._logger('info', 'Execute - GetWikiOperation');
        const wiki = await this._getWikiService.get(id);
        return wiki;
    }
}
